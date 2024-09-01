import { HttpErrorResponse } from '@angular/common/http';
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
import { SelectItem } from 'primeng/api';
import {
    PensionCategoryMasterService,
    PensionFactoryService,
} from 'src/app/api';
import { firstValueFrom } from 'rxjs';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-primary',
    templateUrl: './primary.component.html',
    styleUrls: ['./primary.component.scss'],
})
export class PrimaryComponent {
    expandedRows: expandedRows = {};
    displayInsertModal: boolean = false;
    primaryForm!: FormGroup;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    tableActionButton: ActionButtonConfig[] = [];
    tableChildActionButton: ActionButtonConfig[] = [];
    tableData: any;
    count: number = 0;
    isTableDataLoading: boolean = false;
    treasuryReceiptId!: string;
    selectedRow: any;
    PrimaryOption: SelectItem[] = [];
    type: SelectItem[] = [];
    selectedDrop: SelectItem = { value: '' };
    rowData: any;
    refresh_b = false;

    constructor(
        private toastService: ToastService,
        private fb: FormBuilder,
        private service: PensionCategoryMasterService,
        private generate: PensionFactoryService
    ) {}

    @Output() Primary_Category_Details = new EventEmitter<any>();

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.initializeForm();

        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        // this.tableData = sd;
        this.getData();
    }

    showInsertDialog() {
        this.displayInsertModal = true;
        this.primaryForm.reset();
if(!environment.production){
        this.generateData();
}
    }

    handleRowSelection($event: any) {
        console.log('Row selected:', $event);
    }

    handQueryParameterChange(event: any) {
        console.log('Query parameter changed:', event);
        this.tableQueryParameters = {
            pageSize: event.pageSize,
            pageIndex: event.pageIndex / 10,
            filterParameters: event.filterParameters || [],
            sortParameters: event.sortParameters,
        };
        this.getData();
    }

    handsearchKeyChange(event: string): void {
        if (event == '') {
            this.toastService.showError(`Search can not be empty`);
            return;
        }
        this.findById(event);

        // if (event == '') {
        //     this.toastService.showError(`Search can not be empty`);
        //     return;
        // }
        // let flag = true;
        // const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        // const eve_len = event.length;
        // for (let i = 0; i < eve_len; i++) {
        //     if (!numArr.includes(parseInt(event[i]))) {
        //         flag = false;
        //         break;
        //     }
        // }
        // if (!flag) {
        //     this.toastService.showError(`Search can only contain Category ID`);
        //     return;
        // } else {
        //     this.findById(parseInt(event));
        // }
    }

    initializeForm(): void {
        this.primaryForm = this.fb.group({
            HoaId: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        /^\d{4} - \d{2} - \d{3} - \d{2} - \d{3} - [A-Z] - \d{2} - \d{2}$/
                    ),
                ],
            ],
            PrimaryCategoryName: ['', Validators.required],
        });
    }

    clear(table: any) {
        table.clear();
    }

    onGlobalFilter(dt: any, event: any): void {
        if (event && event.target) {
            const input = event.target as HTMLInputElement;
            dt.filterGlobal(input.value, 'contains');
        }
    }

    async add_primary_category() {
        if (this.primaryForm.valid) {
            const formData = this.primaryForm.value;
            let response = await firstValueFrom(
                this.service.createPrimaryCategory(formData)
            );

            if (response.apiResponseStatus === 1) {
                // Assuming 1 means success

                this.displayInsertModal = false; // Close the dialog
                this.toastService.showSuccess(
                    'Primary Category Details added successfully'
                );
            } else {
                this.handleErrorResponse(response);
            }
            this.getData();
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
                HoaId: data.result.hoaId,
                PrimaryCategoryName: data.result.primaryCategoryName,
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
            this.toastService.showError(
                'This Primary number already exists.'
            );
            this.primaryForm.get('PCID')?.setErrors({ duplicate: true });
        } else {
            this.toastService.showError(
                response.message ||
                    'An unexpected error occurred. Please try again.'
            );
        }
    }

    resetForm() {
        this.primaryForm.reset();
    }

    async getData() {
        const data = this.tableQueryParameters;
        this.isTableDataLoading = true;
        const response = await firstValueFrom(
            this.service.getAllPrimaryCategories(data)
        );

        this.tableData = response.result;
        this.isTableDataLoading = false;
    }
    async findById(data: any) {
        let payload = this.tableQueryParameters;
        payload.filterParameters = [
            { field: 'HoaId', value: data, operator: 'contains' },
        ];
        payload.pageIndex = 0;
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.service.getAllPrimaryCategories(payload)
        );
        if (response.result?.data?.length != 0) {
            this.tableData = response.result;
            this.refresh_b = true;
        } else {
            this.toastService.showError('No Pension Category ID found');
        }

        this.isTableDataLoading = false;
    }

    fun_refresh() {
        this.refresh_b = false;
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.getData();
    }

    emitPrimaryCategory(): void {
        this.Primary_Category_Details.emit(this.primaryForm.value);
    }

    cancelPrimaryCategory() {
        this.primaryForm.reset();
        this.displayInsertModal = false;
    }
}
