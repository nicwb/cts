import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import {
    PensionComponentRateService,
    ComponentRateEntryDTO,
    ComponentRateResponseDTOJsonAPIResponse,
    PensionBreakupResponseDTO,
} from 'src/app/api';
import { PensionCategoryMasterService } from 'src/app/api';
import { PensionComponentService } from 'src/app/api';
import { Observable, catchError, firstValueFrom, tap } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-component-rate',
    templateUrl: './component-rate.component.html',
    styleUrls: ['./component-rate.component.scss'],
})
export class ComponentRateComponent implements OnInit {
    allPensionCategory$?: Observable<any>;
    pensionComponent$?: Observable<any>;

    ComponentRateForm: FormGroup = new FormGroup({});
    amountPlaceHolder: String = '₹';
    //store the component rate data
    data?: any;
    cols: any[] = [];
    records: any[] = [];
    loading: boolean = false;
    constructor(
        private service: PensionComponentRateService,
        private pensionCategoryMasterService: PensionCategoryMasterService,
        private pensionComponentService: PensionComponentService,
        private PensionComponentRateService: PensionComponentRateService,
        private toastService: ToastService,
        private formBuilder: FormBuilder
    ) {}

    //formBuilder create
    initializeForm() {
        this.ComponentRateForm = this.formBuilder.group({
            categoryId: ['', Validators.required],
            categoryName: [''],
            breakupId: ['', Validators.required],
            componentName: [''],
            effectiveFromDate: ['', Validators.required],
            rateType: ['A', Validators.required],
            rateAmount: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.initializeForm();
        let payload = {
            pageSize: 10,
            pageIndex: 0,
            filterParameters: [],
            sortParameters: {
                field: '',
                order: '',
            },
        };
        this.allPensionCategory$ =
            this.pensionCategoryMasterService.getAllCategories(payload);

        this.pensionComponent$ =
            this.pensionComponentService.getAllComponents(payload);
    }

    getFormattedDate(date: Date | null): string {
        if (date) {
            return formatDate(date, 'yyyy-MM-dd', 'en-US');
        }
        return '';
    }

    //for first search button
    handleSelectedRowByPensionCategory(event: any) {
        this.ComponentRateForm.controls['categoryId'].setValue(event.id);
        this.ComponentRateForm.controls['categoryName'].setValue(
            event.categoryName
        );
    }

    //for second search button
    handleSelectedRowByPensionComponent(event: any) {
        this.ComponentRateForm.controls['breakupId'].setValue(event.id);
        this.ComponentRateForm.controls['componentName'].setValue(
            event.componentName
        );
    }

    formatDate(): void {
        const effectiveFromDate =
            this.ComponentRateForm.get('effectiveFromDate')?.value;
        if (effectiveFromDate) {
            // Convert the string to a Date object
            const dateObject = new Date(effectiveFromDate);
            const formattedDate = this.getFormattedDate(dateObject);

            this.ComponentRateForm.controls['effectiveFromDate'].setValue(
                formattedDate
            );
        }
    }

    // remove that fild not required for server
    removeUnwantedAttributes(): void {
        this.ComponentRateForm.removeControl('categoryName');
        this.ComponentRateForm.removeControl('componentName');
    }

    //change amount placeholder according to selecte rate type
    onSelectRtaeRateType($event: any): void {
        const rateType = this.ComponentRateForm.get('rateType')?.value;
        if (rateType === 'A') {
            this.amountPlaceHolder = '₹';
        } else if (rateType === 'P') {
            this.amountPlaceHolder = '%';
        }
    }
    //convert response into a table format
    convertResponseToTable(dataset: any): void {
        if (dataset.headers && dataset.data) {
            this.data = dataset;
            const { headers, data } = dataset;

            this.records = data; // Use dataset.data directly

            if (headers) {
                this.cols = headers.map((header: any) => ({
                    field: header.fieldName,
                    header: header.name,
                }));
                this.loading = false;
            }

            console.log('Records:', this.records);
            console.log('Cols:', this.cols);
        }
    }

    //Show the list view
    async fetchAllDetails(): Promise<void> {
        this.loading = true;
        let payload = {
            pageSize: 10,
            pageIndex: 0,
            filterParameters: [],
            sortParameters: {
                field: '',
                order: '',
            },
        };

        await firstValueFrom(
            this.PensionComponentRateService.getAllComponentRates(payload).pipe(
                tap((response) => {
                    if (response && response.result) {
                        console.log(response.result);
                        this.convertResponseToTable(response.result);
                    }
                })
            )
        );
    }

    async onSubmit(event: Event) {
        event.preventDefault(); // Prevent default form submission
        console.log('onSubmit called');
        this.formatDate();
        this.removeUnwantedAttributes();

        if (this.ComponentRateForm.valid) {
            // Convert the form values to the expected DTO format
            const formValues = this.ComponentRateForm.value;
            const componentRateEntryDTO: ComponentRateEntryDTO = {
                categoryId: formValues.categoryId
                    ? Number(formValues.categoryId)
                    : 0, // Convert string to number
                breakupId: formValues.breakupId
                    ? Number(formValues.breakupId)
                    : 0, // Convert string to number
                effectiveFromDate: formValues.effectiveFromDate || '',
                rateType: formValues.rateType || '',
                rateAmount: formValues.rateAmount
                    ? Number(formValues.rateAmount)
                    : 0,
            };

            await firstValueFrom(
                this.PensionComponentRateService.createComponentRate(
                    componentRateEntryDTO
                ).pipe(
                    tap((response: ComponentRateResponseDTOJsonAPIResponse) => {
                        if (response.message) {
                            if (response.apiResponseStatus === 1) {
                                this.fetchAllDetails();
                                this.toastService.showSuccess(response.message);
                            } else {
                                this.toastService.showError(response.message);
                            }
                        }
                    })
                )
            );
        }
    }

    // Method to reset the form and re-add removed controls
    resetForm(): void {
        // Re-add the removed controls
        this.ComponentRateForm.addControl('categoryName', new FormControl(''));
        this.ComponentRateForm.addControl('componentName', new FormControl(''));

        // Reset the form to its initial state
        this.ComponentRateForm.reset();

        this.records = [];
        this.cols = [];
    }

    resetAndReload(): void {
        this.resetForm();
        this.data = undefined;
    }
}
