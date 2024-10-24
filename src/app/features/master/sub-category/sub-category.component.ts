import { HttpErrorResponse } from '@angular/common/http';
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
import { firstValueFrom, Observable } from 'rxjs';
import {
    APIResponseStatus,
    PensionCategoryMasterService,
    PensionFactoryService,
} from 'src/app/api';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-sub-category',
    templateUrl: './sub-category.component.html',
    styleUrls: ['./sub-category.component.scss'],
})
export class SubCategoryComponent implements OnInit {
    displayInsertModal: boolean = false;
    SubForm!: FormGroup;
    searching = {
        val: false,
        data: null,
    };
    isTableVisible: boolean = false;
    primary!: string;
    sub!: string;
    called_from_pension = false;

    subCategory$?: Observable<any>;
    suffix = 'subCategory';

    constructor(
        private toastService: ToastService,
        private fb: FormBuilder,
        private service: PensionCategoryMasterService,
        private pensionFactoryService: PensionFactoryService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private SessionStorageService: SessionStorageService
    ) {}

    @Output() Sub_Category_Details = new EventEmitter<any>();

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.initializeForm();

        this.check_if_called();
        const endpoint = this.route.snapshot.url
            .map((segment) => segment.path)
            .join('/');
        if (endpoint == 'sub-category/new') {
            this.showInsertDialog();
        }
    }

    check_if_called() {
        let todo = null;
        this.route.queryParams.subscribe((params) => {
            (todo = params['todo']),(this.primary = params['primary']),(this.sub = params['sub']);
        });
        console.log(todo);
        if (todo == 'create') {
            this.called_from_pension = true;
            this.showInsertDialog();
        } else {
            this.called_from_pension = false;
        }
    }
    showInsertDialog() {
        this.displayInsertModal = true;
        this.SubForm.reset();
        if (!environment.production) {
            this.isTableVisible = false;
            this.generateNewData();
        }
    }

    async generateNewData(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.pensionFactoryService.createFake(
                    'PensionSubCategoryEntryDTO'
                )
            );
            this.SubForm.patchValue({
                SubCategoryName: data.result.subCategoryName,
            });
        } catch (error) {
            this.toastService.showError(
                'Failed to patch new subcategory details.'
            );
        }
    }

    handleRowSelection($event: any) {
        console.log('Row selected:', $event);
    }

    initializeForm(): void {
        this.SubForm = this.fb.group({
            SubCategoryName: ['', Validators.required],
        });
    }

    clear(table: any) {
        table.clear();
    }

    async add_Sub_category() {
        if (this.SubForm.valid) {
            const formData = this.SubForm.value;
            let name = this.SubForm.value.SubCategoryName;
            const response = await firstValueFrom(
                this.service.createSubCategory(formData)
            );

            if (response.apiResponseStatus === APIResponseStatus.Success) {
                this.displayInsertModal = false; // Close the dialog
                this.SessionStorageService.remove(
                    '',
                    '',
                    'PensionCategoryComponent_subCategoryCacheKey'
                );
                this.SessionStorageService.remove(
                    '',
                    '',
                    `DynamicTableComponent_${this.suffix}`
                );

                this.toastService.showSuccess('' + response.message);
                if (this.called_from_pension == true) {
                    this.router.navigate(['master/pension-category'], {
                        queryParams: { primary: this.primary, sub: name },
                    });
                }
            } else {
                this.handleErrorResponse(response);
            }
        }
    }

    private handleErrorResponse(response: any) {
        if (
            response.message &&
            response.message.includes(
                'duplicate key value violates unique constraint'
            )
        ) {
            this.toastService.showError('This already exsists.');
            this.SubForm.get('PCID')?.setErrors({ duplicate: true });
        } else {
            this.toastService.showError(
                response.message ||
                    'An unexpected error occurred. Please try again.'
            );
        }
    }

    resetForm() {
        this.SubForm.reset();
    }

    async getData() {
        this.isTableVisible = true;

        this.subCategory$ = this.service.getSubCategories();
    }

    emitSubCategory(): void {
        this.Sub_Category_Details.emit(this.SubForm.value);
    }


    cancelSubCategory() {
        this.SubForm.reset();
        this.displayInsertModal = false;
    }
    newSubcategory() {
        this.router.navigate(['/master/sub-category/new']);
    }
    onDialogClose() {
        this.location.back();
    }
}
