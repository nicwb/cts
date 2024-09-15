import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { BillPrintService } from 'src/app/core/services/bill-print/bill-print.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { PensionRegularBillService, PpoBillEntryDTO } from 'src/app/api';
import { FileGenerationBillPrintService } from 'src/app/core/services/File_Generation_Bill_Print/file-generation-bill-print.service';

@Component({
    selector: 'app-regular-pension-pension-bill',
    templateUrl: './regular-pension-pension-bill.component.html',
    styleUrls: ['./regular-pension-pension-bill.component.scss']
})
export class RegularPensionPensionBillComponent implements OnInit {

    billPrintForm: FormGroup = new FormGroup({});
    months: SelectItem[] = [];
    isGenerating: boolean = false;
    progress: number = 0;
    progressMessage: string = '';

    constructor(
      private fb: FormBuilder,
      private toastService: ToastService,
      private pensionRegularBillService: PensionRegularBillService,
      private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.billPrintForm = this.fb.group({
            months: ['', Validators.required],
            year: [new Date(), Validators.required],
        });

        this.months = [
            { label: 'January', value: { id: 1, name: 'January', code: 'Jan' } },
            { label: 'February', value: { id: 2, name: 'February', code: 'Feb' } },
            { label: 'March', value: { id: 3, name: 'March', code: 'March' } },
            { label: 'April', value: { id: 4, name: 'April', code: 'April' } },
            { label: 'May', value: { id: 5, name: 'May', code: 'May' } },
            { label: 'June', value: { id: 6, name: 'June', code: 'June' } },
            { label: 'July', value: { id: 7, name: 'July', code: 'July' } },
            { label: 'August', value: { id: 8, name: 'August', code: 'Aug' } },
            { label: 'September', value: { id: 9, name: 'September', code: 'Sep' } },
            { label: 'October', value: { id: 10, name: 'October', code: 'Oct' } },
            { label: 'November', value: { id: 11, name: 'November', code: 'Nov' } },
            { label: 'December', value: { id: 12, name: 'December', code: 'Dec' } }
        ];
    }

    onYearSelect(event: Date) {
        const selectedYear = event.getFullYear();
        this.billPrintForm.patchValue({
            year: new Date(selectedYear, 0, 1)
        });
    }

    onRefresh(): void {
        this.billPrintForm.reset();
        this.progress = 0;
        this.progressMessage = '';
        this.isGenerating = false;
    }

    async onGenerate() {
        if (this.billPrintForm.valid) {
            this.isGenerating = true;
            this.progress = 0;
            this.progressMessage = 'Starting bill generation';

            try {
                const formValue = this.billPrintForm.value;
                const year = formValue.year.getFullYear();
                const month = formValue.months.id;

                // Fetch PPO list
                this.progressMessage = 'Fetching PPO list...';
                this.progress = 10;

                const ppoList = await firstValueFrom(this.pensionRegularBillService.getAllPposForRegularBill(year, month));
                this.progress = 30;

                const totalPpos = Object.keys(ppoList?.result ?? {}).length || 0;
                if (totalPpos) {
                    this.progressMessage = `Found ${totalPpos} PPOs. Processing...`;
                    const ppoValues = Object.values(ppoList?.result ?? {});

                    for (let i = 0; i < totalPpos; i++) {
                        const ppo = ppoValues[0][i];
                        const ppoBillEntryDTO: PpoBillEntryDTO = {
                            ppoId: ppo.ppoId,
                            toDate: new Date().toISOString().split('T')[0]
                        };

                        await firstValueFrom(this.pensionRegularBillService.saveRegularPensionBill(ppoBillEntryDTO));
                        this.progress = 30 + Math.floor(((i + 1) / totalPpos) * 70);
                        this.progressMessage = `Saving bill for PPO ${i + 1} of ${totalPpos}`;
                        this.changeDetectorRef.detectChanges();
                    }

                    this.progress = 100;
                    this.progressMessage = 'All bills saved successfully!';
                    this.toastService.showSuccess('All bills saved successfully');
                } else {
                    this.progressMessage = 'No PPOs found for the selected period.';
                    this.toastService.showWarning('No PPOs found for the selected period.');
                    this.progress = 100;
                }
            } catch (error) {
                console.error('Error saving bills', error);
                this.toastService.showError('Error saving bills');
                this.progressMessage = 'Error occurred while saving bills.';
            } finally {
                this.isGenerating = false;
            }
        } else {
            this.toastService.showError('Please fill all required fields');
        }
    }
}