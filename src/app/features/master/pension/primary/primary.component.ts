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
import { convertDate } from 'src/utils/dateConversion';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { PrimaryCategoryDetails } from 'src/app/core/models/primary-category-details';
import { PrimaryCategoryDetailsService } from 'src/app/core/services/primaryCategoryDetails/primary-category-details.service';
import { PensionCategoryMasterService } from 'src/app/api';
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
    modalData: PrimaryCategoryDetails[] = [];
    count: number = 0;
    isTableDataLoading: boolean = false;
    treasuryReceiptId!: string;
    manaualPpoPayload!: PrimaryCategoryDetails;
    selectedRowData: PrimaryCategoryDetails | null = null;
    selectedRow: any;
    PrimaryOption: SelectItem[] = [];
    type: SelectItem[] = [];
    selectedDrop: SelectItem = { value: '' };
    rowData: any;
    refresh_b = false;

    constructor(
        private datePipe: DatePipe,
        private toastService: ToastService,
        private PrimaryCategoryDetailsService: PrimaryCategoryDetailsService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private service: PensionCategoryMasterService
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
        console.log(this.tableQueryParameters);
        this.getData();
    }

    handsearchKeyChange(event: string): void {
        console.log('Search key changed:', event);
        if (event == '') {
            this.toastService.showError(`Search can not be empty`);
            return;
        }
        let flag = true;
        const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        const eve_len = event.length;
        for (let i = 0; i < eve_len; i++) {
            if (!numArr.includes(parseInt(event[i]))) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            this.toastService.showError(`Search can only contain Category ID`);
            return;
        } else {
            this.findById(parseInt(event));
        }
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

    // Add Manual PPO Receipt
    async add_primary_category() {
        if (this.primaryForm.valid) {
            const formData = this.primaryForm.value;
            let response = await firstValueFrom(
                this.service.createPrimaryCategory(formData)
            );

            if (response.apiResponseStatus === 1) {
                // Assuming 1 means success
                console.log('Form submitted successfully:', response);

                this.displayInsertModal = false; // Close the dialog
                this.toastService.showSuccess(
                    'Primary Category Details added successfully'
                );
            } else {
                this.handleErrorResponse(response);
            }
            this.getData();
        } else {
            console.log('Form is not valid. Cannot submit.');
            this.toastService.showError(
                'Please fill all required fields correctly.'
            );
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
                'This PPO number already exists. Please use a different PPO number.'
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
        console.log(this.tableData);
    }
    async findById(id: any) {
        let payload = this.tableQueryParameters;
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.service.getAllPrimaryCategories(payload)
        );

        if (response.apiResponseStatus === 1) {
            let value = response.result?.data;
            let flag = false;
            let Data = response.result?.data;
            let DataCount = response.result?.dataCount;
            console.log(response.result);

            if (value) {
                const len_val = value.length;
                for (let i = 0; i < len_val; i++) {
                    if (value[i].id == id) {
                        Data = [value[i]];
                        DataCount = 1;
                        this.refresh_b = true;
                        flag = true;
                        break;
                    }
                }
            }

            if (!flag) {
                this.toastService.showError('No Pension Category ID found');
                return;
            }

            this.tableData = {
                data: Data,
                dataCount: DataCount,
                headers: response.result?.headers,
            };
        }

        this.isTableDataLoading = false;
    }

    fun_refresh() {
        this.refresh_b = false;
        this.getData();
    }

    onRowEditCancel() {
        this.selectedRowData = null;
        this.resetForm();
    }

    emitPrimaryCategory(): void {
        this.Primary_Category_Details.emit(this.primaryForm.value);
    }

    cancelPrimaryCategory() {
        this.primaryForm.reset();
        this.displayInsertModal = false;
    }
}
