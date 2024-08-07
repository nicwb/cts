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
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { Component_interface } from 'src/app/core/models/component';
import { ComponentService } from 'src/app/core/services/Component/component.service';
interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-component',
    templateUrl: './component.component.html',
    styleUrls: ['./component.component.scss'],
})
export class ComponentComponent {
    expandedRows: expandedRows = {};
    displayInsertModal: boolean = false;
    ComponentForm!: FormGroup;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    tableActionButton: ActionButtonConfig[] = [];
    tableChildActionButton: ActionButtonConfig[] = [];
    tableData: any;
    modalData: Component_interface[] = [];
    count: number = 0;
    isTableDataLoading: boolean = false;
    treasuryReceiptId!: string;
    manaualPpoPayload!: Component_interface;
    selectedRowData: Component_interface | null = null;
    selectedRow: any;
    PrimaryOption: SelectItem[] = [];
    type: SelectItem[] = [];
    selectedDrop: SelectItem = { value: '' };
    rowData: any;
    payment: SelectItem = { value: '' };
    Payment_Deduction:SelectItem[] = [];
    relief_allowed: SelectItem = { value: '' };
    allowed: SelectItem[] = [];
    connection:string = '';
    Payment:boolean = false;
    Deduction:boolean = false;
    constructor(
        private datePipe: DatePipe,
        private toastService: ToastService,
        private ComponentService: ComponentService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {}


    @Output() ComponentSelected = new EventEmitter<any>();

    ngOnInit(): void {
        this.initializeForm();

        this.allowed = [
            { label: 'Y', value: true },
            { label: 'N', value: false },
          ];
        this.Payment_Deduction = [
            { label: 'P', value: 'Payment' },
            { label: 'D', value: 'Deduction' },
          ];

        this.tableQueryParameters = {
            pageSize: 30,
            pageIndex: 0,
        };
        
        this.getData();
    }

    check(){
        if(this.connection=='P'){
            this.Payment=true;
        }
        else if(this.connection=='D'){
            this.Deduction=true;
        }
    }

    showInsertDialog() {
        this.displayInsertModal = true;
        this.ComponentForm.reset();
    }

   

    handleRowSelection($event: any) {
        console.log('Row selected:', $event);
    }

    handQueryParameterChange(event: any) {
        console.log('Query parameter changed:', event);
        this.tableQueryParameters = {
            pageSize: event.pageSize,
            pageIndex: event.pageIndex,
            filterParameters: event.filterParameters || [],
            sortParameters: event.sortParameters,
        };
        console.log(this.tableQueryParameters.pageSize);

        // this.get_all_component_details(this.tableQueryParameters);
    }

    handsearchKeyChange(event: string): void {
        console.log('Search key changed:', event);
        this.tableQueryParameters.filterParameters = [
            { field: 'searchKey', value: event },
        ];
        // this.get_all_component_details_forSearch(this.tableQueryParameters, event);
    }

    initializeForm(): void {
        this.ComponentForm = this.fb.group({
            ComponentName: ['',[Validators.required]],
            ComponentType: ['',[Validators.required,Validators.pattern(/^['P','D']/)]],
            ReliefFlag: [null,[Validators.required,]]
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

    // Add Component Detalis
    addComponentDetails() {
        console.log("addComponentDetails")
        if (this.ComponentForm.valid) {
            const formData = this.ComponentForm.value;
            this.ComponentService
                .add_new_component_details(formData)
                .subscribe(
                    (response) => {
                        if (response.apiResponseStatus === 1) {
                            // Assuming 1 means success
                            console.log(
                                'Form submitted successfully:',
                                response
                            );
                            console.log(response.result);
                            
                            this.displayInsertModal = false; // Close the dialog
                            this.toastService.showSuccess(
                                'Component Details added successfully'
                            );
                        }
                        this.getData();
                        // else {
                        //     this.handleErrorResponse(response);
                        // }
                        

                    },
                    (error) => {
                        console.error('Error submitting form:', error);
                        this.handleErrorResponse(error.error);
                    }
                );
        } 
        else {
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
                ' already exists.'
            );
            this.ComponentForm.get('PCID')?.setErrors({ duplicate: true });
        } else {
            this.toastService.showError(
                response.message ||
                    'An unexpected error occurred. Please try again.'
            );
        }
    }

    resetForm() {
        this.ComponentForm.reset();
    }

    // Get Component Details
    get_all_component_details (bill_component_id: string) {
        console.log('Fetching Component By Id...');
        this.ComponentService
            .GetAllComponentDetails(bill_component_id)
            .subscribe((response) => {
                console.log('API Response:', response);
                if (response.apiResponseStatus === 1) {
                    this.tableData = response.result;
                } else {
                    this.toastService.showAlert(
                        response.message,
                        response.apiResponseStatus
                    );
                }
            });
    }

    

    getData() {
        const data = this.tableQueryParameters
        this.isTableDataLoading = true;
        this.ComponentService
            .get_all_component_details(data)
            .subscribe(
                (response: any) => {
                    this.tableData = response.result;
                    this.isTableDataLoading = false;
                    console.log(response.result);
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


    onRowEditInit(data: Component_interface) {
        this.selectedRowData = { ...data };
        this.ComponentForm.patchValue(this.selectedRowData);
        this.displayInsertModal = true;
    }

    onRowEditCancel() {
        this.selectedRowData = null;
        this.resetForm();
    }

    emitComponent(): void {
        this.ComponentSelected.emit(this.ComponentForm.value);
    }

    cancelComponent() {
        this.ComponentForm.reset();
        this.displayInsertModal = false;
    }
}