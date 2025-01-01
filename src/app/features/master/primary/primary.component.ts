import { environment } from 'src/environments/environment';
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    ActionButtonConfig,
    DynamicTable,
    DynamicTableQueryParameters,
    TableHeader,
} from 'mh-prime-dynamic-table';
import { ToastService } from 'src/app/core/services/toast.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { SelectItem } from 'primeng/api';
import {
    APIResponseStatus,
    PensionCategoryMasterService,
    PensionFactoryService,
    PensionPrimaryCategoryEntryDTO,
} from 'src/app/api';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-primary',
    templateUrl: './primary.component.html',
    styleUrls: ['./primary.component.scss'],
})
export class PrimaryComponent implements OnInit {
    displayInsertModal: boolean = false; //used to display insert modal
    primaryForm!: FormGroup;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    isTableDataLoading: boolean = false;
    selectedRow: any;
    called_from_pension = false;
    primary!: string;
    sub!: string;
    isTableVisible: boolean = false;
    primaryCategory$?: Observable<any>;
    suffix = 'primaryCategory';
    hoaService$?: Observable<any>;
    accountHeadId: any; //used to fetch accountHeadId for saving primary category

    constructor(
        private toastService: ToastService,
        private fb: FormBuilder,
        private service: PensionCategoryMasterService,
        private generate: PensionFactoryService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private sessionStorageService: SessionStorageService
    ) {}

    @Output() Primary_Category_Details = new EventEmitter<any>();

    ngOnInit(): void {
        this.initializeForm();
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.hoaService$ = this.service.getAccountHeads();
        this.check_if_called();

        // add deplenk
        const endpoint = this.route.snapshot.url
            .map((segment) => segment.path)
            .join('/');
        if (endpoint == 'primary/new') {
            this.showInsertDialog();
        }

        this.primaryCategory$ = this.service.getPrimaryCategories();
    }

    showInsertDialog() {
        this.displayInsertModal = true;
        this.isTableVisible = false;
        this.primaryForm.reset();
        if (!environment.production) {
            this.generateData();
        }
    }

    handleRowSelection($event: any) {
        this.primaryForm.patchValue({
            accountHead: $event.headDetails,
        });
        this.accountHeadId = $event.id;
    }

    // handQueryParameterChange(event: any) {
    //     console.log('Query parameter changed:', event);
    //     this.tableQueryParameters = {
    //         pageSize: event.pageSize,
    //         pageIndex: event.pageIndex / 10,
    //         filterParameters: event.filterParameters || [],
    //         sortParameters: event.sortParameters,
    //     };
    //     this.getData();
    // }

    // handsearchKeyChange(event: string): void {
    //     if (event == '') {
    //         this.toastService.showError(`Search can not be empty`);
    //         return;
    //     }
    //     this.findById(event);
    // }
    check_if_called() {
        let todo = null;

        this.route.queryParams.subscribe((params) => {
            (todo = params['todo']),
            (this.primary = params['primary']),
            (this.sub = params['sub']);
        });

        //console.log(todo, this.primary, this.sub);
        if (todo == 'create') {
            this.called_from_pension = true;
            this.showInsertDialog();
        } else {
            this.called_from_pension = false;
        }
    }

    initializeForm(): void {
        this.primaryForm = this.fb.group({
            accountHead: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        /^\d{4}-\d{2}-\d{3}-\d{2}-\d{3}-[A-Z]-\d{2}-\d{2}$/
                    ),
                ],
            ],
            primaryCategoryName: ['', Validators.required],
        });
    }

    // clear(table: any) {
    //     table.clear();
    // }

    // onGlobalFilter(dt: any, event: any): void {
    //     if (event && event.target) {
    //         const input = event.target as HTMLInputElement;
    //         dt.filterGlobal(input.value, 'contains');
    //     }
    // }

    async add_primary_category() {
        if (this.primaryForm.valid) {
            const payload: PensionPrimaryCategoryEntryDTO = {
                accountHeadId: this.accountHeadId,
                primaryCategoryName: this.primaryForm.value.primaryCategoryName,
            };
            let response = await firstValueFrom(
                this.service.createPrimaryCategory(payload)
            );

            if (response.apiResponseStatus === APIResponseStatus.Success) {
                this.sessionStorageService.remove('', '', `${this.suffix}`);
                this.sessionStorageService.remove('', '', 'primaryCategorys');
                this.displayInsertModal = false;
                this.toastService.showSuccess('' + response.message);
                if (this.called_from_pension == true) {
                    this.router.navigate(['master/pension-category'], {
                        queryParams: {
                            primary: this.primaryForm.value.primaryCategoryName,
                            sub: this.sub,
                        },
                    });
                }
            } else {
                this.handleErrorResponse(response);
            }
        } else {
            this.toastService.showError(
                'Please fill all required fields correctly.'
            );
        }
    }
    async generateData(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.generate.createFake('PensionPrimaryCategoryEntryDTO')
            );
            this.primaryForm.patchValue({
                primaryCategoryName: data.result.primaryCategoryName,
            });
        } catch (error) {
            this.toastService.showError('Failed to fetch');
        }
    }

    private handleErrorResponse(response: any) {
        if (
            response.message &&
            response.message.includes(
                'duplicate key value violates unique constraint'
            )
        ) {
            this.toastService.showError('This Primary number already exists.');
            this.primaryForm.get('PCID')?.setErrors({ duplicate: true });
        } else {
            this.toastService.showError(
                response.message ||
                    'An unexpected error occurred. Please try again.'
            );
        }
    }

    async getData() {
        const data = this.tableQueryParameters;
        this.isTableDataLoading = true;
        this.isTableVisible = true;
        // this.isTableDataLoading = false;
    }
    // async findById(data: any) {
    //     let payload = this.tableQueryParameters;
    //     payload.filterParameters = [
    //         { field: 'accountHead', value: data, operator: 'contains' },
    //     ];
    //     payload.pageIndex = 0;
    //     this.isTableDataLoading = true;
    //     let response = await firstValueFrom(
    //         this.service.getAllPrimaryCategories(payload)
    //     );
    //     if (response.result?.data?.length != 0) {
    //         this.tableData = response.result;
    //         this.refresh_b = true;
    //     } else {
    //         this.toastService.showError('No Pension Category ID found');
    //     }

    //     this.isTableDataLoading = false;
    // }

    emitPrimaryCategory(): void {
        this.Primary_Category_Details.emit(this.primaryForm.value);
    }

    cancelPrimaryCategory() {
        this.primaryForm.reset();
        this.displayInsertModal = false;
    }

    newPrimarycategory() {
        this.router.navigate(['/master/primary/new']);
    }
    onDialogClose() {
        this.location.back();
    }
}
