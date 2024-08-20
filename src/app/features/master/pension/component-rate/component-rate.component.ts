import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import {
    PensionComponentRateService,
    ComponentRateEntryDTO,
    ComponentRateResponseDTOJsonAPIResponse,
    PensionBreakupResponseDTO,
} from 'src/app/api';
import { PensionCategoryMasterService } from 'src/app/api';
import { PensionComponentService } from 'src/app/api';
import { Observable, firstValueFrom, tap } from 'rxjs';
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

    getFormattedDate(date: Date | null): string {
        if (date) {
            return formatDate(date, 'yyyy-MM-dd', 'en-US');
        }
        return '';
    }

    ComponentRateForm = new FormGroup({
        categoryId: new FormControl('', Validators.required),
        breakupId: new FormControl('', Validators.required),
        effectiveFromDate: new FormControl('', Validators.required),
        rateType: new FormControl('A', Validators.required),
        rateAmount: new FormControl('', Validators.required),
    });

    constructor(
        private service: PensionComponentRateService,
        private pensionCategoryMasterService: PensionCategoryMasterService,
        private pensionComponentService: PensionComponentService,
        private PensionComponentRateService: PensionComponentRateService,
        private toastService: ToastService,
    ) {}
    ngOnInit(): void {
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

    handleSelectedRowByPensionCategory(event: any) {
        this.ComponentRateForm.controls['categoryId'].setValue(event.id);
    }
    handleSelectedRowByPensionComponent(event: any) {
        console.log(event);

        this.ComponentRateForm.controls['breakupId'].setValue(event.id);
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

    async onSubmit() {
        this.formatDate();
        console.log(this.ComponentRateForm.value);
        if (this.ComponentRateForm.valid) {
            await firstValueFrom(
                this.PensionComponentRateService.createComponentRate(
                    this.ComponentRateForm.value as ComponentRateEntryDTO
                ).pipe(
                    tap((response: ComponentRateResponseDTOJsonAPIResponse) => {
                        if (response.message) {
                            if (response.apiResponseStatus === 1) {
                                this.toastService.showSuccess(response.message);
                            }
                            else {
                                this.toastService.showError(response.message);
                            }
                        }
                      
                    })
                )
            );
        }
    }
}
