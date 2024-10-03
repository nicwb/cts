import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { PensionRegularBillService, PpoBillEntryDTO } from 'src/app/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-regular-pension-bill',
    templateUrl: './regular-pension-bill.component.html',
    styleUrls: ['./regular-pension-bill.component.scss']
})
export class RegularPensionBillComponent implements OnInit {
    ppoId?: number;
    billPrintForm: FormGroup = new FormGroup({});
    months: SelectItem[] = [];
    isGenerating: boolean = false;
    progress: number = 0;
    progressMessage: string = '';
    ppoCount: number | null = null;
    ppoList: any[] = [];
    failedMessages: string[] = [];
    


    constructor(
        private fb: FormBuilder,
        private toastService: ToastService,
        private pensionRegularBillService: PensionRegularBillService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router
    ) {}


    ngOnInit(): void {
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
        const currentMonthIndex = new Date().getMonth();
        const currentMonth = this.months[currentMonthIndex];
        this.billPrintForm = this.fb.group({
            months: [currentMonth.value, Validators.required], 
            year: [new Date(), Validators.required], 
        });
    }

    onYearSelect(event: Date) {
        if (event && event instanceof Date) {
            const selectedYear = event.getFullYear();
            this.billPrintForm.patchValue({
                year: new Date(selectedYear, 0, 1)
            });
        }
    }
    

    async onFetchPPOBills() {
        if (this.billPrintForm.valid) {
            this.isGenerating = true;
            this.progressMessage = 'Fetching PPO list...';
            this.progress = 10;
    
            try {
                const formValue = this.billPrintForm.value;
                const year = formValue.year.getFullYear();
                const month = formValue.months.id;
    
                const response = await firstValueFrom(this.pensionRegularBillService.getAllPposForRegularBill(year, month));
                console.log('Fetched PPOs:', response); // Debugging line
                
                if (response?.result?.ppoList) {
                    this.ppoList = response.result.ppoList;
                    this.ppoCount = this.ppoList.length;
    
                    if (this.ppoCount > 0) {
                        this.progressMessage = `Found ${this.ppoCount} PPOs available for processing.`;
                        this.toastService.showSuccess(`${this.ppoCount} PPO bills found.`);
                    } else {
                        this.progressMessage = 'No PPO bills found for the selected period.';
                        this.toastService.showWarning('No PPO bills found.');
                    }
                } else {
                    throw new Error('Unexpected API response structure.');
                }
            } catch (error) {
                console.error('Error fetching PPO bills', error);
                this.toastService.showError('Error fetching PPO bills');
                this.ppoCount = null;
                this.ppoList = [];
            } finally {
                this.isGenerating = false;
                this.progress = 0;
            }
        } else {
            this.toastService.showError('Please fill all required fields');
        }
    }
    
    

    async onGenerate() {
        if (this.billPrintForm.valid && this.ppoCount !== null && this.ppoList.length > 0) {
            this.isGenerating = true;
            this.progress = 0;
            this.progressMessage = 'Starting bill generation...';
            this.failedMessages = [];  // Reset failedMessages
    
            let successCount = 0;
            let failedPPOs: { ppoId: string; message: string }[] = [];
    
            try {
                for (let i = 0; i < this.ppoList.length; i++) {
                    const ppo = this.ppoList[i];
    
                    if (!ppo || !ppo.ppoId) {
                        console.warn(`Skipping PPO with undefined ppoId at index ${i}`);
                        continue;
                    }
    
                    const ppoBillEntryDTO: PpoBillEntryDTO = {
                        ppoId: ppo.ppoId,
                        month: this.billPrintForm.controls['months'].value,
                        year: this.billPrintForm.controls['year'].value,
                        toDate: new Date().toISOString().split('T')[0]
                    };
    
                    try {
                        const response = await firstValueFrom(this.pensionRegularBillService.saveRegularPensionBill(ppoBillEntryDTO));
                        
                        if (response.apiResponseStatus === 'Success') {
                            successCount++;
                        } else {
                            failedPPOs.push({ ppoId: ppo.ppoId, message: response.message ?? 'Unknown error' });
                        }
    
                    } catch (error: any) {
                        failedPPOs.push({ ppoId: ppo.ppoId, message: error?.error?.message || 'Unknown error' });
                    }
    
                    this.updateProgress(successCount, this.ppoList.length, failedPPOs.length);
                }
    
                // Display summary messages
                if (successCount > 0) {
                    this.toastService.showSuccess(`${successCount} PPO bills saved successfully.`);
                }
                
                if (failedPPOs.length > 0) {
                    this.failedMessages = this.formatFailedPPOsMessage(failedPPOs);
                    this.toastService.showWarning(`${failedPPOs.length} PPO bills failed to save.`);
                }
    
                if (successCount === 0 && failedPPOs.length > 0) {
                    this.toastService.showError('All bills failed to save.');
                }
    
            } catch (error) {
                console.error('Error saving bills', error);
                this.toastService.showError('Error occurred while saving bills');
                this.failedMessages = ['An unexpected error occurred while saving bills.'];
            } finally {
                this.isGenerating = false;
                this.updateProgress(successCount, this.ppoList.length, failedPPOs.length);
                this.changeDetectorRef.detectChanges();
            }
        } else {
            this.toastService.showError('Please fetch PPO bills before generating.');
        }
    }
    
    private formatFailedPPOsMessage(failedPPOs: { ppoId: string; message: string }[]): string[] {
        const maxDisplayed = 5;
        const formattedMessages = failedPPOs.slice(0, maxDisplayed).map(failed => 
            `PPO ID ${failed.ppoId}: ${failed.message}`
        );
        
        if (failedPPOs.length > maxDisplayed) {
            formattedMessages.push(`... and ${failedPPOs.length - maxDisplayed} more`);
        }
    
        return formattedMessages;
    }
    
    private updateProgress(successCount: number, total: number, failedCount: number) {
        this.progress = Math.floor((successCount / total) * 100);
        this.progressMessage = `Processed ${successCount + failedCount} of ${total} PPOs. ${successCount} succeeded, ${failedCount} failed.`;
        this.changeDetectorRef.detectChanges();
    }
    
    billprint(): void{
        this.router.navigate(
            this.ppoId 
                ? ['/pension/modules/pension-process/bill-print', this.ppoId, 'regular-pension']
                : ['/pension/modules/pension-process/bill-print/regular-pension']
        );
    }
    
    onRefresh(): void {
        this.billPrintForm.reset();
        this.progress = 0;
        this.progressMessage = '';
        this.ppoCount = null;
        this.ppoList = [];
        this.isGenerating = false;
    
        // Optionally, fetch updated data if needed
        this.onFetchPPOBills();
    }
    
}
