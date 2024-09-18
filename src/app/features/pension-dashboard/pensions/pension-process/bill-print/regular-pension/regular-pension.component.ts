import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { BillPrintService } from 'src/app/core/services/bill-print/bill-print.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { PensionRegularBillService, BankService, PensionCategoryMasterService, BranchDeatilsDTOJsonAPIResponse } from 'src/app/api';
import { FileGenerationBillPrintService } from 'src/app/core/services/File_Generation_Bill_Print/file-generation-bill-print.service';
import { firstValueFrom, forkJoin, Observable, tap } from 'rxjs';

@Component({
    selector: 'app-regular-pension',
    templateUrl: './regular-pension.component.html',
    styleUrls: ['./regular-pension.component.scss']
})
export class RegularPensionComponent implements OnInit {
  
    BillPrintForm: FormGroup = new FormGroup({});
    months: SelectItem[] = [];
    loading!: boolean;
    banksBranch?: any;
    banks: any = [];
    categoryCode: any = [];
    categoryComponent$?: Observable<any>;


    constructor(private fb: FormBuilder, private toastService: ToastService, private billPrintService: BillPrintService ,private fileGeneration: FileGenerationBillPrintService, private pensionRegularBillService: PensionRegularBillService, private bankService: BankService, private categoryService: PensionCategoryMasterService) {
  
    }

 
    ngOnInit(): void {
        let payload = {
            pageSize: 10,
            pageIndex: 0,
            filterParameters: [],
            sortParameters: {
                field: '',
                order: '',
            }
        };

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

        const currentMonth = this.getCurrentMonth();

        this.BillPrintForm = this.fb.group({
            choices: ['', Validators.required],
            months: [currentMonth, Validators.required],
            year: [new Date(), Validators.required],
            bank: [''],
            category: ['']
        });

        this.categoryComponent$ = this.categoryService.getAllCategories(payload);
  
        // Fetch banks
        this.fetchBanks();
        this.applyChoiceValidators();
    }

    applyChoiceValidators(): void {
        this.BillPrintForm.get('choices')?.valueChanges.pipe(
            tap(async (choice) => {
                // Reset the form control validations based on the choice
                const bankControl = this.BillPrintForm.get('bank');
                const categoryControl = this.BillPrintForm.get('category');
    
                if (choice === 'specificBackAllCategory' || choice === 'specificBankSpecificCategory') {
                    // Enable and make bank required
                    bankControl?.setValidators([Validators.required]);
                    bankControl?.enable();
                } else {
                    // Disable and clear validators for bank
                    bankControl?.clearValidators();
                    bankControl?.disable();
                }
    
                if (choice === 'allBankSpecificCategory' || choice === 'specificBankSpecificCategory') {
                    // Enable and make category required
                    categoryControl?.setValidators([Validators.required]);
                    categoryControl?.enable();
                } else {
                    // Disable and clear validators for category
                    categoryControl?.clearValidators();
                    categoryControl?.disable();
                }
    
                bankControl?.updateValueAndValidity();
                categoryControl?.updateValueAndValidity();
            })
        ).toPromise(); // Use firstValueFrom-like behavior by converting to Promise
    }
    

    private getCurrentMonth(): any {
        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        return this.months.find(month => month.value.id === currentMonthIndex + 1)?.value;
    }

    private async fetchBanks() {
        try {
            const response = await firstValueFrom(this.bankService.getAllBanks());
            if (response.result) {
                this.banks = response.result.map((bank: any) => ({
                    label: bank.name,
                    value: bank
                }));
            } else {
                this.toastService.showWarning('No banks found');
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            this.toastService.showError('Error fetching banks');
        }
    }


    async onChangeBank(event: any) {
        if (event.value && event.value.code) {
            this.BillPrintForm.patchValue({ bankCode: event.value.code });
            const response = await firstValueFrom(this.bankService.getBranchesByBankCode(event.value.code).pipe(
                tap((res) => {
                    if (res.result) {
                        this.banksBranch = res.result;
                    } else {
                        this.toastService.showWarning('No bank branches found');
                    }
                })
            ));
            this.BillPrintForm.get('bankName')?.setValue(event.value.name);
        } else {
            this.banksBranch = undefined;
        }
    }
    


    handleCategorySearchEvent(event: any) {
        this.BillPrintForm.controls['category'].setValue(event.categoryName);
        this.categoryCode = event.id;
    }


    onYearSelect(event: Date) {
        const selectedYear = event.getFullYear();
        this.BillPrintForm.patchValue({
            year: new Date(selectedYear, 0, 1)
        });
    }

    onRefresh(): void{
        this.BillPrintForm.reset();
    }

    private getBankName(choice: string, bankFormValue: any): string {
        if (choice === 'all' || choice === 'allBankSpecificCategory') {
            return 'All Bank';
        } else {
            return bankFormValue.value.name;
        }
    }

    onGenerate(generation: string) {
        if (this.BillPrintForm.valid) {
            const formValue = this.BillPrintForm.value;
            const year = formValue.year.getFullYear();
            const month = formValue.months.id;
            const selectedMonth = this.months.find(m => m.value.id === month)?.value.name;
            const bankName = this.getBankName(formValue.choices, formValue.bank);

            this.loading = true; 

            try {
                const isAllBank = formValue.choices === 'all' || formValue.choices === 'allBankSpecificCategory';
                const isAllCategory = formValue.choices === 'all' || formValue.choices === 'specificBackAllCategory';

                switch (formValue.choices) {
                case 'all':
                    this.generateAllReport(year, month, selectedMonth, bankName, isAllBank, isAllCategory);
                    break;
                case 'allBankSpecificCategory':
                    this.generateAllBankSpecificCategoryReport(year, month, this.categoryCode, selectedMonth, bankName, isAllBank, isAllCategory);
                    break;
                case 'specificBackAllCategory':
                    this.generateSpecificBankAllCategoryReport(year, month, formValue.bank.value.code, selectedMonth, bankName, isAllBank, isAllCategory);
                    break;
                case 'specificBankSpecificCategory':
                    this.generateSpecificBankSpecificCategoryReport(year, month, formValue.bank.value.code, this.categoryCode, selectedMonth, bankName, isAllBank, isAllCategory);
                    break;
                default:
                    throw new Error('Invalid choice selected');
                }
            } catch (error) {
                console.error('Error generating report', error);
            } finally {
                this.loading = false; 
            }
        } else {
            console.error('Form is invalid');
        }
    }

    // Update these methods to include the new parameters
    private async generateAllReport(year: number, month: number, selectedMonth: string, bankName: string, isAllBank: boolean, isAllCategory: boolean) {
        try {
            const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month));
            this.processBillsAndGeneratePdf(response.result, bankName, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        }
    }

    private async generateAllBankSpecificCategoryReport(year: number, month: number, categoryId: number, selectedMonth: string, bankName: string, isAllBank: boolean, isAllCategory: boolean) {
        try {
            const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month, categoryId));
            this.processBillsAndGeneratePdf(response.result, bankName, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        }
    }

    private async generateSpecificBankAllCategoryReport(year: number, month: number, bankId: number, selectedMonth: string, bankName: string, isAllBank: boolean, isAllCategory: boolean) {
        try {
            const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month, undefined, bankId));
            this.processBillsAndGeneratePdf(response.result, bankName, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        }
    }

    private async generateSpecificBankSpecificCategoryReport(year: number, month: number, bank: number, category: number, selectedMonth: string, bankName: string, isAllBank: boolean, isAllCategory: boolean) {
        try {
            const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month, category, bank));
            this.processBillsAndGeneratePdf(response.result, bankName, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        }
    }

    private async processBillsAndGeneratePdf(bills: any, bankName: string, year: number, selectedMonth: string, isAllBank: boolean, isAllCategory: boolean) {
        if (!bills || bills.length === 0) {
            this.toastService.showWarning('No bills found');
            return;
        }
        const branchCode = bills.bills[0].ppoBills[0].pensioner.bankAccounts[0].branchCode;
    
        try {
            const value: BranchDeatilsDTOJsonAPIResponse = await firstValueFrom(this.bankService.getBranchByBranchCode(branchCode));
            const branchName = value.result?.branchName ?? '';
            const reportData = { bills: bills };
            this.fileGeneration.generatePdf(reportData, branchName, bankName, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error fetching bank name:', error);
            this.toastService.showError('Error fetching bank name');
        }
    }

    showBankInput(): boolean {
        const choices = this.BillPrintForm.get('choices')?.value;
        return choices === 'specificBackAllCategory' || choices === 'specificBankSpecificCategory';
    }
    
    showCategoryInput(): boolean {
        const choices = this.BillPrintForm.get('choices')?.value;
        return choices === 'allBankSpecificCategory' || choices === 'specificBankSpecificCategory';
    }    
}