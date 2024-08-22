import { Component, OnInit } from '@angular/core';
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

    constructor(
        private service: PensionComponentRateService,
        private pensionCategoryMasterService: PensionCategoryMasterService,
        private pensionComponentService: PensionComponentService,
        private PensionComponentRateService: PensionComponentRateService,
        private toastService: ToastService,
        private formBuilder: FormBuilder
    ) {}

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
        console.log();
        this.pensionComponent$ =
            this.pensionComponentService.getAllComponents(payload);
    }

    getFormattedDate(date: Date | null): string {
        if (date) {
            return formatDate(date, 'yyyy-MM-dd', 'en-US');
        }
        return '';
    }

    handleSelectedRowByPensionCategory(event: any) {
        console.log(event);
        this.ComponentRateForm.controls['categoryId'].setValue(event.id);
        this.ComponentRateForm.controls['categoryName'].setValue(
            event.categoryName
        );
    }
    handleSelectedRowByPensionComponent(event: any) {
        console.log(event);
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

    removeUnwantedAttributes(): void {
        this.ComponentRateForm.removeControl('categoryName');
        this.ComponentRateForm.removeControl('componentName');
    }

    async onSubmit() {
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
}
