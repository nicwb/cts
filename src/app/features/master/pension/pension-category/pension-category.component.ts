import { FormData } from 'src/app/core/models/indentFormData';
import { SubCategoryComponent } from './../sub-category/sub-category.component';
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
import { PensionCategoryDetails } from 'src/app/core/models/pension-category-details';
import { PensionCategoryDetailsService } from 'src/app/core/services/pensionCategoryDetails/pension-category-details.service';

interface expandedRows {
    [key: string]: boolean;
}
@Component({
    selector: 'app-pension-category',
    templateUrl: './pension-category.component.html',
    styleUrls: ['./pension-category.component.scss'],
})
export class PensionCategoryComponent implements OnInit {
    expandedRows: expandedRows = {};
    displayInsertModal: boolean = false;
    PensionForm!: FormGroup;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    tableActionButton: ActionButtonConfig[] = [];
    tableChildActionButton: ActionButtonConfig[] = [];
    tableData: any;
    modalData: PensionCategoryDetails[] = [];
    count: number = 0;
    isTableDataLoading: boolean = false;
    treasuryReceiptId!: string;
    manaualPensionPayload!: PensionCategoryDetails;
    selectedRowData: PensionCategoryDetails | null = null;
    selectedRow: any;
    PensionOption: SelectItem[] = [];
    type: SelectItem[] = [];
    selectedDrop: SelectItem = { value: '' };
    primary_id_select: SelectItem[] = [];
    sub_id_select: SelectItem[] = [];
    rowData: any;
    refresh_b = false;

    constructor(
        private datePipe: DatePipe,
        private toastService: ToastService,
        private PensionCategoryDetailsService: PensionCategoryDetailsService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {}

    @Output() PensionCategorySelected = new EventEmitter<any>();

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.initializeForm();

        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.getData();
    }

    showInsertDialog() {
        this.displayInsertModal = true;
        this.PensionForm.reset();
        this.primary_id_select = [];
        this.sub_id_select = [];
        this.get_id_from_primary_category();
        this.get_id_from_sub_category();
    }

    handleRowSelection($event: any) {
        console.log('Row selected:', $event);
    }

    handQueryParameterChange(event: any) {
        console.log('Query parameter changed:', event);
        this.tableQueryParameters = {
            pageSize: event.pageSize,
            pageIndex: event.pageIndex/10,
            filterParameters: event.filterParameters || [],
            sortParameters: event.sortParameters,
        };
        console.log(this.tableQueryParameters.pageSize);
        this.getData();
    }
    // searching without get api
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
    initializeForm(): void {
        this.PensionForm = this.fb.group({
            PrimaryCategoryId: ['', Validators.required],
            SubCategoryId: ['', Validators.required],
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
    // Add pension category
    add_Pension_category() {
        if (this.PensionForm.valid) {
            const formData = this.PensionForm.value;
            this.PensionCategoryDetailsService.add_new_Pension_details(
                formData
            ).subscribe(
                (response) => {
                    if (response) {
                        console.log(response);
                        // Assuming 1 means success
                        this.displayInsertModal = false; // Close the dialog
                        this.checkIfAlreadyExsist(formData);
                    } else {
                        this.handleErrorResponse(response);
                    }
                    this.getData();
                },
                (error) => {
                    console.error('Error submitting form:', error);
                    this.handleErrorResponse(error.error);
                }
            );
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
                'This Pension number already exists. Please use a different Pension number.'
            );
            this.PensionForm.get('PCID')?.setErrors({ duplicate: true });
        } else {
            this.toastService.showError(
                response.message ||
                    'An unexpected error occurred. Please try again.'
            );
        }
    }
    resetForm() {
        this.PensionForm.reset();
    }

    getData() {
        const data = this.tableQueryParameters;
        this.isTableDataLoading = true;
        this.PensionCategoryDetailsService.get_all_Pension_details(
            data
        ).subscribe(
            (response: any) => {
                this.tableData = response.result;
                this.isTableDataLoading = false;
            },
            (error) => {
                this.isTableDataLoading = false;
                console.error('API Error:', error);
                this.toastService.showAlert(
                    'An error occurred while fetching data',
                    0
                );
            }
        );
    }

    //get id from  primary
    get_id_from_primary_category() {
        const data = this.tableQueryParameters;
        this.PensionCategoryDetailsService.get_all_primary_details(
            data
        ).subscribe(
            (response: any) => {
                this.isTableDataLoading = false;
                let value = response.result.data;
                value = [...value];

                let len_val = value.length;
                for (let i = 0; i < len_val; i++) {
                    this.primary_id_select.push({
                        label: value[i].id,
                        value: value[i].id,
                    });
                }
            },
            (error) => {
                this.isTableDataLoading = false;
                console.error('API Error:', error);
                this.toastService.showAlert(
                    'An error occurred while fetching data',
                    0
                );
            }
        );
    }
    //get id from  sub
    get_id_from_sub_category() {
        const data = this.tableQueryParameters;
        this.PensionCategoryDetailsService.get_all_Sub_details(data).subscribe(
            (response: any) => {
                this.isTableDataLoading = false;
                let value = response.result.data;
                value = [...value];

                let primary_id = this.tableData;

                let len_val = value.length;
                for (let i = 0; i < len_val; i++) {
                    this.sub_id_select.push({
                        label: value[i].id,
                        value: value[i].id,
                    });
                }
            },
            (error) => {
                this.isTableDataLoading = false;
                console.error('API Error:', error);
                this.toastService.showAlert(
                    'An error occurred while fetching data',
                    0
                );
            }
        );
    }

    checkIfAlreadyExsist(parms: any) {
        let flag = true;
        let value = this.tableData.data;
        let match_from1 = parms.PrimaryCategoryId;
        let match_from2 = parms.SubCategoryId;
        let len_val = value.length;
        for (let i = 0; i < len_val; i++) {
            if (
                value[i].primaryCategoryId == match_from1 &&
                value[i].subCategoryId == match_from2
            ) {
                flag = false;
            }
        }
        if (flag == true) {
            this.toastService.showSuccess(
                'Pension Category Details added successfully'
            );
        } else {
            this.toastService.showError(
                'Pension Category Details already exsists'
            );
        }
    }

    findById(id: any) {

        const data = this.tableQueryParameters;
        this.isTableDataLoading = true;
        this.PensionCategoryDetailsService.get_all_Pension_details(
            data
        ).subscribe(
            (response: any) => {
                let flag = false;
                let data= response.result;
                let value = response.result.data;
                console.log(value);
                let len_val = value.length;
                for (let i = 0; i < len_val; i++) {
                    if (value[i].id == id) {
                        data.data = [value[i]];
                        data.dataCount = 1;
                        this.refresh_b = true;
                        flag = true;
                        this.tableData=data;
                    }
                }
                if (flag == false) {
                    this.toastService.showError('No Pension Category ID found');
                }

                console.log(this.tableData);
                this.isTableDataLoading = false;
            },
            (error) => {
                this.isTableDataLoading = false;
                console.error('API Error:', error);
                this.toastService.showAlert(
                    'An error occurred while fetching data',
                    0
                );
            }
        );

    }

    fun_refresh() {
        this.refresh_b = false;
        this.getData();
    }

    emitPensionCategorySelected(): void {
        this.PensionCategorySelected.emit(this.PensionForm.value);
    }

    cancelPensionCategory() {
        this.PensionForm.reset();
        this.displayInsertModal = false;
        this.primary_id_select = [];
        this.sub_id_select = [];
    }
}
