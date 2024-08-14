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
import { SubCategoryDetalis } from 'src/app/core/models/sub-category-detalis';
import { SubCategoryDetailsService } from 'src/app/core/services/subCategoryDetails/sub-category-details.service';
import { firstValueFrom } from 'rxjs';
import { PensionCategoryMasterService } from 'src/app/api';
import { Console } from 'console';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-sub-category',
    templateUrl: './sub-category.component.html',
    styleUrls: ['./sub-category.component.scss'],
})
export class SubCategoryComponent implements OnInit {
    expandedRows: expandedRows = {};
    displayInsertModal: boolean = false;
    SubForm!: FormGroup;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    tableActionButton: ActionButtonConfig[] = [];
    tableChildActionButton: ActionButtonConfig[] = [];
    tableData: any;
    modalData: SubCategoryDetalis[] = [];
    count: number = 0;
    isTableDataLoading: boolean = false;
    treasuryReceiptId!: string;
    manaualPpoPayload!: SubCategoryDetalis;
    selectedRowData: SubCategoryDetalis | null = null;
    selectedRow: any;
    SubOption: SelectItem[] = [];
    type: SelectItem[] = [];
    selectedDrop: SelectItem = { value: '' };
    rowData: any;
    refresh_b = false;

    constructor(
        private datePipe: DatePipe,
        private toastService: ToastService,
        private SubCategoryDetalisService: SubCategoryDetailsService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private service: PensionCategoryMasterService
    ) {}

    @Output() Sub_Category_Details = new EventEmitter<any>();

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.initializeForm();

        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };

        this.getData();
        // this.showVAL();
    }

    showInsertDialog() {
        this.displayInsertModal = true;
        this.SubForm.reset();
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

    // async showVAL(){
    //     let data = this.tableQueryParameters;
    //     data.pageSize=9999999;
    //     const x = await firstValueFrom(this.service.getAllSubCategories(data))
    //     console.log(x);
    // }
    // async postVAL(){
    //     const formData = this.SubForm.value;
    //     const resp=await firstValueFrom(this.service.createSubCategory(formData));
    //     console.log(resp);
    //     this.getData();
    // }

    handsearchKeyChange(event: string): void {
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

    async findById(id: any) {
        let payload = this.tableQueryParameters;
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.service.getAllSubCategories(payload)
        );

        if (response.apiResponseStatus === 1) {
            let value = response.result?.data;
            let flag = false;
            let Data = response.result?.data;
            let DataCount=response.result?.dataCount;
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
                headers:response.result?.headers
            };

        }

        this.isTableDataLoading = false;
    }
    initializeForm(): void {
        this.SubForm = this.fb.group({
            SubCategoryName: ['', Validators.required],
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
    async add_Sub_category() {
        if (this.SubForm.valid) {
            const formData = this.SubForm.value;
            const response = await firstValueFrom(
                this.service.createSubCategory(formData)
            );

            if (response.apiResponseStatus === 1) {
                console.log('Form submitted successfully:', response);
                this.displayInsertModal = false; // Close the dialog
                this.toastService.showSuccess(
                    'Sub Category Details added successfully'
                );
            } else {
                this.handleErrorResponse(response);
            }
            this.getData();
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
        const data = this.tableQueryParameters;
        this.isTableDataLoading = true;
        const response = await firstValueFrom(
            this.service.getAllSubCategories(data)
        );
        if (response.apiResponseStatus === 1) {
            this.tableData = response.result;
            this.isTableDataLoading = false;
        }
    }

    fun_refresh() {
        this.refresh_b = false;
        this.getData();
    }

    emitSubCategory(): void {
        this.Sub_Category_Details.emit(this.SubForm.value);
    }

    cancelSubCategory() {
        this.SubForm.reset();
        this.displayInsertModal = false;
    }
}
