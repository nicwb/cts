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
import { firstValueFrom,Observable,observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
interface expandedRows {
    [key: string]: boolean;
}
@Component({
    selector: 'app-component',
    templateUrl: './component.component.html',
    styleUrls: ['./component.component.scss'],
})
export class ComponentComponent implements OnInit {
    displayInsertModal: boolean = false;
    ComponentForm!: FormGroup;
    payment: SelectItem = { value: '' };
    Payment_Deduction: SelectItem[] = [];
    isTableVisible: boolean = false;

    component$?: Observable<any>;
    suffix = 'component';




    constructor(
        private datePipe: DatePipe,
        private toastService: ToastService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private Service: PensionComponentService,
        private pensionFactoryService : PensionFactoryService,
        private route:ActivatedRoute,
        private router: Router,
        private location: Location,
        private SessionStorageService: SessionStorageService
    ) {}

    @Output() ComponentSelected = new EventEmitter<any>();

    ngOnInit(): void {
        this.initializeForm();
        this.Payment_Deduction = [
            { value: 'P', label: 'Payment' },
            { value: 'D', label: 'Deduction' },
        ];

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



    // Add Component Detalis
    async addComponentDetails() {
        if (this.ComponentForm.valid) {
            const formData = this.ComponentForm.value;
            let response = await firstValueFrom(
                this.Service.createComponent(formData)
            );
            if (response.apiResponseStatus === APIResponseStatus.Success) {
                // Assuming 1 means success
                this.displayInsertModal = false; // Close the dialog
                this.toastService.showSuccess(
                    'Component Details added successfully'
                );
                this.SessionStorageService.remove('', '', `DynamicTableComponent_${this.suffix}`)

            } else {
                this.handleErrorResponse(response);
            }

        } else {
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
        // const data = this.tableQueryParameters;
        // this.isTableDataLoading = true;
        // const response = await firstValueFrom(
        //     this.Service.getAllComponents(data)
        // );
        // if (response.apiResponseStatus != APIResponseStatus.Success) {

        //     this.toastService.showAlert(
        //         'An error occurred while fetching data',
        //         0
        //     );
        //     return;
        // }
        // this.tableData = response.result;
        this.isTableVisible = true;
        // this.isTableDataLoading = false;
        this.component$=this.Service.getComponents();
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
