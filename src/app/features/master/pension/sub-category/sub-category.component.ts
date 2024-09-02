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
import { SelectItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { PensionCategoryMasterService,PensionFactoryService } from 'src/app/api';
import { environment } from 'src/environments/environment';

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
    count: number = 0;
    isTableDataLoading: boolean = false;
    treasuryReceiptId!: string;
    selectedRow: any;
    SubOption: SelectItem[] = [];
    type: SelectItem[] = [];
    selectedDrop: SelectItem = { value: '' };
    rowData: any;
    refresh_b = false;
    searching={
        val:false,
        data:null
    };
    constructor(
        private toastService: ToastService,
        private fb: FormBuilder,
        private service: PensionCategoryMasterService,
        private pensionFactoryService: PensionFactoryService
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
        if(!environment.production){
            this.generateNewData();
        }
    }

    async generateNewData(): Promise<void> {
        try{
            const data = await firstValueFrom(this.pensionFactoryService.createFake("PensionSubCategoryEntryDTO"));
            this.SubForm.patchValue({
                SubCategoryName:data.result.subCategoryName
            });
        }
        catch(error){
            this.toastService.showError('Failed to patch new subcategory details.');
        }
    }

    handleRowSelection($event: any) {
        console.log('Row selected:', $event);
    }

    handQueryParameterChange(event: any) {
        console.log('Query parameter changed:', event);
        if(this.searching.val==true){
            this.tableQueryParameters = {
                pageSize: event.pageSize,
                pageIndex: event.pageIndex / 10,
                filterParameters: [{ field: "SubCategoryName", value: this.searching.data, operator: 'contains'}],
                sortParameters: event.sortParameters,
            };
        }
        else{this.tableQueryParameters = {
                pageSize: event.pageSize,
                pageIndex: event.pageIndex / 10,
                filterParameters: event.filterParameters || [],
                sortParameters: event.sortParameters,
            };
        }

        this.getData();
    }


    handsearchKeyChange(event: string): void {
        if(event == ""){
            this.toastService.showError(`Search can not be empty`);
            return;
        }
        this.findById(event);
    }

    async findById(data: any) {
        let payload = this.tableQueryParameters;
        payload.filterParameters = [{ field: "SubCategoryName", value: data, operator: 'contains'}];
        payload.pageIndex=0;
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.service.getAllSubCategories(payload)
        );
        console.log(response);
        if(response.result?.data?.length!=0){
            this.tableData = response.result;
            this.refresh_b = true;
            this.searching.val=true;
            this.searching.data=data;
        }else{
            this.toastService.showError('No Pension Category ID found');
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
    async add_Sub_category() {
        if (this.SubForm.valid) {
            const formData = this.SubForm.value;

            const response = await firstValueFrom(
                this.service.createSubCategory(formData)
            );

            if (response.apiResponseStatus === 1) {
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
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.searching.val=false;
        this.searching.data=null;
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
