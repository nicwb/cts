import { PrimaryCategory } from './../../../../core/models/pension-bill';
import { Payload } from './../../../../core/models/search-query';
import { FormData } from 'src/app/core/models/indentFormData';
import { HttpErrorResponse } from '@angular/common/http';
import { PensionCategoryMasterService } from 'src/app/api';
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ElementRef,
    AfterViewInit,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    ActionButtonConfig,
    DynamicTable,
    DynamicTableQueryParameters,
    TableHeader,
} from 'mh-prime-dynamic-table';

import { ToastService } from 'src/app/core/services/toast.service';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { PensionCategoryDetails } from 'src/app/core/models/pension-category-details';
import { PensionCategoryDetailsService } from 'src/app/core/services/pensionCategoryDetails/pension-category-details.service';
import { Observable, filter, firstValueFrom } from 'rxjs';

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
    primary_id_select: SelectItem[] = [];
    sub_id_select: SelectItem[] = [];
    rowData: any;
    refresh_b = false;
    primary_id!: string;
    sub_id!: string;
    searching = {
        val: false,
        data: null,
    };
    primary_table = false;
    sub_table = false;
    @ViewChild('subFilterSearch', { static: false }) dropdownRef!: ElementRef;

    constructor(
        // private datePipe: DatePipe,
        private toastService: ToastService,
        private service: PensionCategoryMasterService
    ) {}

    @Output() PensionCategorySelected = new EventEmitter<any>();

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.initializeForm();
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.get_id_from_primary_category();
        this.get_id_from_sub_category();
        this.getData();
    }

    showInsertDialog() {
        this.displayInsertModal = true;
        this.PensionForm.reset();
    }

    handleRowSelection($event: any) {
        console.log('Row selected:', $event);
    }

    handQueryParameterChange(event: any) {
        console.log('Query parameter changed:', event);
        if (this.searching.val == true) {
            this.tableQueryParameters = {
                pageSize: event.pageSize,
                pageIndex: event.pageIndex / 10,
                filterParameters: [
                    {
                        field: 'CategoryName',
                        value: this.searching.data,
                        operator: 'contains',
                    },
                ],
                sortParameters: event.sortParameters,
            };
        } else {
            this.tableQueryParameters = {
                pageSize: event.pageSize,
                pageIndex: event.pageIndex / 10,
                filterParameters: event.filterParameters || [],
                sortParameters: event.sortParameters,
            };
        }

        this.getData();
    }
    // searching without get api
    handsearchKeyChange(event: string): void {
        if (event == '') {
            this.toastService.showError(`Search can not be empty`);
            return;
        }
        this.findById(event);
    }
    initializeForm(): void {
        this.PensionForm = new FormGroup({
            PrimaryCategoryId: new FormControl('', [Validators.required]),
            SubCategoryId: new FormControl('', [Validators.required]),
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
    async add_Pension_category() {
        if (this.PensionForm.valid) {
            const formData = this.PensionForm.value;
            let response = await firstValueFrom(
                this.service.createCategory(formData)
            );
            if (response) {
                // Assuming 1 means success
                this.displayInsertModal = false; // Close the dialog
                this.checkIfAlreadyExsist(formData);
            } else {
                this.handleErrorResponse(response);
            }
            this.getData();
            console.log(response);
        }
    }
    async find_extra_primary_id(filterValue: any) {
        console.log(filterValue);
        const id = filterValue.filter;
        if (id == null) {
            return;
        }
        console.log(id);
        let data = {
            pageSize: 10000,
            pageIndex: 0,
            filterParameters: [
                { field: 'PrimaryCategoryName', value: id, operator: 'contains' },
            ],
        };

        let response = await firstValueFrom(
            this.service.getAllPrimaryCategories(data)
        );
        this.isTableDataLoading = false;

        if (response.result && response.result.data) {
            let value = response.result.data;
            if (value.length != 0) {
                let len_val = value.length;
                this.primary_id_select = [];
                for (let i = 0; i < len_val; i++) {
                    this.primary_id_select.push({
                        label: `${value[i].id}-${value[i].primaryCategoryName}`,
                        value: value[i].id,
                    });
                }
            } else {
                this.toastService.showError('Could Not Found');
            }
        } else {
            console.error('Invalid response from API');
        }
    }
    async find_extra_sub_id(filterValue: any) {
        const id = filterValue.filter;
        if (id == null) {
            return;
        }
        console.log(id);
        let data = {
            pageSize: 10000,
            pageIndex: 0,
            filterParameters: [
                { field: 'SubCategoryName', value: id, operator: 'contains' },
            ],
        };
        let response = await firstValueFrom(
            this.service.getAllSubCategories(data)
        );
        this.isTableDataLoading = false;

        if (response.result && response.result.data) {
            let value = response.result.data;
            if (value.length != 0) {
                let len_val = value.length;
                this.sub_id_select = [];
                for (let i = 0; i < len_val; i++) {
                    this.sub_id_select.push({
                        label: `${value[i].id}-${value[i].subCategoryName}`,
                        value: value[i].id,
                    });
                }
            } else {
                this.toastService.showError('Could Not Found');
            }
        } else {
            console.error('Invalid response from API');
        }
    }
    clicked_Primary(id: any, lable: any) {
        this.primary_id = lable;
        console.log(this.primary_id);
        let value_for_patch = {
            PrimaryCategoryId: id,
        };
        this.PensionForm.patchValue(value_for_patch);
    }
    clicked_Sub(id: any, label: any) {
        this.sub_id = label;
        console.log(this.sub_id);
        let value_for_patch = {
            SubCategoryId: id,
        };
        this.PensionForm.patchValue(value_for_patch);
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

    async getData() {
        const data = this.tableQueryParameters;
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.service.getAllCategories(data)
        );
        if (response.apiResponseStatus === 1) {
            this.tableData = response.result;
            this.isTableDataLoading = false;
        } else {
            this.toastService.showError("Can't get Data");
        }
    }

    //get id from  primary
    async get_id_from_primary_category() {
        let data = this.tableQueryParameters;
        data.pageSize = 10;
        let response = await firstValueFrom(
            this.service.getAllPrimaryCategories(data)
        );
        this.isTableDataLoading = false;

        if (response.result && response.result.data) {
            let value = response.result.data;
            let len_val = value.length;

            for (let i = 0; i < len_val; i++) {
                this.primary_id_select.push({
                    label:`${value[i].id}-${value[i].primaryCategoryName}`,
                    value: value[i].id,
                });
            }
            this.primary_table = true;
        } else {
            console.error('Invalid response from API');
        }
    }
    //get id from  sub
    async get_id_from_sub_category() {
        let data = this.tableQueryParameters;
        data.pageSize = 10;
        let response = await firstValueFrom(
            this.service.getAllSubCategories(data)
        );
        this.isTableDataLoading = false;

        if (response.result && response.result.data) {
            let value = response.result.data;
            let len_val = value.length;

            for (let i = 0; i < len_val; i++) {
                this.sub_id_select.push({
                    label: `${value[i].id}-${value[i].subCategoryName}`,
                    value: value[i].id,
                });
            }
            this.sub_table = true;
        } else {
            console.error('Invalid response from API');
        }
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

    async findById(id: any) {
        let payload = this.tableQueryParameters;
        payload.filterParameters = [
            { field: 'CategoryName', value: id, operator: 'contains' },
        ];
        payload.pageIndex = 0;
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.service.getAllCategories(payload)
        );
        if (response.result?.data?.length != 0) {
            this.tableData = response.result;
            this.refresh_b = true;
            this.searching.val = true;
            this.searching.data = id;
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
        this.searching.val = false;
        this.searching.data = null;
        this.getData();
    }

    emitPensionCategorySelected(): void {
        this.PensionCategorySelected.emit(this.PensionForm.value);
    }

    cancelPensionCategory() {
        this.PensionForm.reset();
        this.displayInsertModal = false;
    }
}
