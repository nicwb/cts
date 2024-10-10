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
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { APIResponseStatus, PensionComponentService, PensionFactoryService } from 'src/app/api';
import { firstValueFrom,observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';
interface expandedRows {
    [key: string]: boolean;
}
@Component({
    selector: 'app-component',
    templateUrl: './component.component.html',
    styleUrls: ['./component.component.scss'],
})
export class ComponentComponent implements OnInit {
    expandedRows: expandedRows = {};
    displayInsertModal: boolean = false;
    ComponentForm!: FormGroup;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    tableActionButton: ActionButtonConfig[] = [];
    tableChildActionButton: ActionButtonConfig[] = [];
    tableData: any;
    count: number = 0;
    isTableDataLoading: boolean = false;
    selectedRow: any;
    PrimaryOption: SelectItem[] = [];
    type: SelectItem[] = [];
    selectedDrop: SelectItem = { value: '' };
    rowData: any;
    payment: SelectItem = { value: '' };
    Payment_Deduction: SelectItem[] = [];
    connection: string = '';
    Payment: boolean = false;
    Deduction: boolean = false;
    refresh_val = false;
    isTableVisible: boolean = false;
    search_button={
        val:false,
        data:null
    };
    
    constructor(
        private datePipe: DatePipe,
        private toastService: ToastService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private Service: PensionComponentService,
        private pensionFactoryService : PensionFactoryService,
        private route:ActivatedRoute,
        private router: Router,
        private location: Location
    ) {}

    @Output() ComponentSelected = new EventEmitter<any>();

    ngOnInit(): void {
        this.initializeForm();
        this.Payment_Deduction = [
            { value: 'P', label: 'Payment' },
            { value: 'D', label: 'Deduction' },
        ];

        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        const url = this.route.snapshot.url.map(sagment => sagment.path).join('/');
        if(url == 'component/new'){
            this.showInsertDialog();
        }
    }


    showInsertDialog() {
        this.displayInsertModal = true;
        this.isTableVisible = false;
        this.ComponentForm.reset();
        this.ComponentForm.patchValue({reliefFlag : false});
        if(!environment.production){
            this.generateNewData();
        }
    }

    async generateNewData(): Promise<void>{
        try{
            const data = await firstValueFrom(this.pensionFactoryService.createFake("PensionBreakupEntryDTO"));
            console.log(data);
            this.ComponentForm.patchValue({
                componentName:data.result.componentName,
                componentType:data.result.componentType,
                reliefFlag:data.result.reliefFlag
            });
        }
        catch(error){
            this.toastService.showError('Failed to fetch component details.');
        }
    }

    handleRowSelection($event: any) {
        console.log('Row selected:', $event);
    }

    handQueryParameterChange(event: any) {
        console.log('Query parameter changed:', event);
        if(this.search_button.val==true){
            this.tableQueryParameters = {
                pageSize: event.pageSize,
                pageIndex: event.pageIndex / 10,
                filterParameters:  [{ field: "ComponentName", value: this.search_button.data, operator: 'contains'}],
                sortParameters: event.sortParameters,
            };
        }
        else{
            this.tableQueryParameters = {
                pageSize: event.pageSize,
                pageIndex: event.pageIndex / 10,
                filterParameters:event.filterParameters || [],
                sortParameters: event.sortParameters,
            };
        }
        this.getData();
    }

    handsearchKeyChange(event: string): void {
        if (event == '') {
            this.toastService.showError('Please fill the search field');
            return;
        }
        this.FindByComponentId(event);
    }
    async FindByComponentId(data: any) {
        const payload = this.tableQueryParameters;
        payload.filterParameters = [{ field: "ComponentName", value: data, operator: 'contains'}];
        payload.pageIndex=0;
        
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.Service.getAllComponents(payload)
        );
        
        if(response.result?.data?.length!=0){
            this.tableData = response.result;
            this.refresh_val = true;
            this.search_button.val=true;
            this.search_button.data=data;
        }else{
            this.toastService.showError('No Component Id found');

        }
        
        this.isTableDataLoading = false;
    }
    refresh_table() {
        this.refresh_val = false;
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.search_button.val=false;
        this.search_button.data=null;
        this.getData();
    }
    initializeForm(): void {
        this.ComponentForm = this.fb.group({
            componentName: ['', [Validators.required]],
            componentType: [
                '',
                [Validators.required],
            ],
            reliefFlag: ['', [Validators.required]],
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
    async addComponentDetails() {
        if (this.ComponentForm.valid) {
            const formData = this.ComponentForm.value;
            let response = await firstValueFrom(
                this.Service.createComponent(formData)
            );
            if (response.apiResponseStatus === APIResponseStatus.Success) {
                // Assuming 1 means success
                console.log('Form submitted successfully:', response);
                this.displayInsertModal = false; // Close the dialog
                this.toastService.showSuccess(
                    'Component Details added successfully'
                );

            } else {
                this.handleErrorResponse(response);
            }
            
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
            this.toastService.showError(' already exists.');
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

    async getData() {
        const data = this.tableQueryParameters;
        this.isTableDataLoading = true;
        const response = await firstValueFrom(
            this.Service.getAllComponents(data)
        );
        if (response.apiResponseStatus != APIResponseStatus.Success) {
            
            this.toastService.showAlert(
                'An error occurred while fetching data',
                0
            );
            return;
        }
        this.tableData = response.result;
        this.isTableVisible = true;
        this.isTableDataLoading = false;
    }

    emitComponent(): void {
        this.ComponentSelected.emit(this.ComponentForm.value);
    }

    cancelComponent() {
        this.ComponentForm.reset();
        this.displayInsertModal = false; 
    }
    createNewcomponent(){
        this.router.navigate(['/master/component/new']);
    }
    onDiloagclose(){
        this.location.back();
    }

}
