import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { BillPrintService } from 'src/app/core/services/bill-print/bill-print.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { PensionRegularBillService, PensionBankBranchService, PensionCategoryMasterService, BankResponseDTO, BranchResponseDTO} from 'src/app/api';
import { FileGenerationBillPrintService } from 'src/app/core/services/File_Generation_Bill_Print/file-generation-bill-print.service';
import { firstValueFrom, forkJoin, Observable, tap } from 'rxjs';
import { BranchDeatilsDTOJsonAPIResponse } from 'src/app/api/model/branch-deatils-dto-json-api-response';

@Component({
    selector: 'app-regular-pension-bill-print',
    templateUrl: './regular-pension-bill-print.component.html',
    styleUrls: ['./regular-pension-bill-print.component.scss']
})
export class RegularPensionBillPrintComponent implements OnInit {

    BillPrintForm: FormGroup = new FormGroup({});
    months: SelectItem[] = [];
    loading!: boolean;
    banksBranch?: any;
    banks: any = [];
    categoryCode: any = [];
    categoryComponent$?: Observable<any>;
    selectedBranchIds: number[] = [];


    constructor(private fb: FormBuilder, private toastService: ToastService, private billPrintService: BillPrintService ,private fileGeneration: FileGenerationBillPrintService, private pensionRegularBillService: PensionRegularBillService, private bankService: PensionBankBranchService, private categoryService: PensionCategoryMasterService) {

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
            category: [''],
            selectedBranches: [[], Validators.required]
        });

        this.categoryComponent$ = this.categoryService.getAllCategories(payload);

        // Fetch banks
        this.fetchBanks();
        this.applyChoiceValidators();
    }

    applyChoiceValidators(): void {
        const choicesControl = this.BillPrintForm.get('choices');
        const bankControl = this.BillPrintForm.get('bank');
        const categoryControl = this.BillPrintForm.get('category');
        const selectedBranchesControl = this.BillPrintForm.get('selectedBranches');

        if (choicesControl) {
            firstValueFrom(choicesControl.valueChanges.pipe(
                tap(async (choice) => {
                    bankControl?.clearValidators();
                    categoryControl?.clearValidators();

                    // Reset selected branches control value
                    this.BillPrintForm.patchValue({ selectedBranches: [] });

                    if (choice === 'specificBackAllCategory' || choice === 'specificBankSpecificCategory') {
                        bankControl?.setValidators([Validators.required]);
                        bankControl?.enable();
                    } else {
                        bankControl?.disable();
                    }

                    if (choice === 'allBankSpecificCategory' || choice === 'specificBankSpecificCategory') {
                        categoryControl?.setValidators([Validators.required]);
                        categoryControl?.enable();
                    } else {
                        categoryControl?.disable();
                    }

                    if (choice === 'specificBranchOrBranches') {
                        bankControl?.setValidators([Validators.required]);
                        bankControl?.enable();
                        selectedBranchesControl?.setValidators([Validators.required, Validators.minLength(1)]);
                        selectedBranchesControl?.enable();
                    } else {
                        selectedBranchesControl?.disable();
                        selectedBranchesControl?.clearValidators(); // Clear validators if not needed
                    }

                    bankControl?.updateValueAndValidity();
                    categoryControl?.updateValueAndValidity();
                    selectedBranchesControl?.updateValueAndValidity();
                    this.BillPrintForm.updateValueAndValidity();
                })
            )).catch(error => {
                console.error('Error in applyChoiceValidators:', error);
                this.toastService.showError('An error occurred while updating form validations');
            });
        }
    }



    private getCurrentMonth(): any {
        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        return this.months.find(month => month.value.id === currentMonthIndex + 1)?.value;
    }

    private async fetchBanks() {
        try {
            const response = await firstValueFrom(this.bankService.getBanks());
            // Check if the response is successful and contains the expected structure
            if (response.apiResponseStatus === 'Success' && response.result && Array.isArray(response.result.banks)) {
                // Map the banks to the desired format
                this.banks = response.result.banks.map((bank: BankResponseDTO) => ({
                    label: bank.bankName,
                    value: bank // You might want to keep the entire bank object as value
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
            const response = await firstValueFrom(this.bankService.getBranchesByBankId(event.value.code).pipe(
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

    onBranchChoiceChange() {
        // Reset selected branches whenever the choice changes
        const selectedBranchesControl = this.BillPrintForm.get('selectedBranches') as FormArray;
        selectedBranchesControl.clear();
    }

    onChangeBankForBranches(event: any) {
        if (event.value) {
            const selectedBankId = event.value.value.id; // Assuming the bank value has an 'id'
            this.fetchBranchesByBankId(selectedBankId);
        } else {
            this.banksBranch = [];
        }
    }

    async fetchBranchesByBankId(bankId: number) {
        try {
            const response = await firstValueFrom(this.bankService.getBranchesByBankId(bankId));
            if (response.result && response.result.branches) {
                this.banksBranch = response.result.branches;
            } else {
                this.toastService.showWarning('No bank branches found');
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            this.toastService.showError('Error fetching branches');
        }
    }


    onBranchSelect(branch: BranchResponseDTO, isChecked: boolean) {
        const selectedBranchesControl = this.BillPrintForm.get('selectedBranches') as FormArray;

        if (isChecked) {
            selectedBranchesControl.push(new FormControl(branch.id)); // Add selected branch ID
        } else {
            const index = selectedBranchesControl.controls.findIndex(x => x.value === branch.id);
            if (index >= 0) {
                selectedBranchesControl.removeAt(index); // Remove unselected branch ID
            }
        }
    }
    onBranchSelectChange(event: any) {
        this.selectedBranchIds = event.value; // Update selected branch IDs
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

    async onGenerate(generation: string) {
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
                    this.generateAllReport(year, month, selectedMonth, isAllBank, isAllCategory);
                    break;
                case 'allBankSpecificCategory':
                    this.generateAllBankSpecificCategoryReport(year, month, this.categoryCode, selectedMonth, isAllBank, isAllCategory);
                    break;
                case 'specificBackAllCategory':
                    this.generateSpecificBankAllCategoryReport(year, month, formValue.bank.value.code, selectedMonth, isAllBank, isAllCategory);
                    break;
                case 'specificBankSpecificCategory':
                    this.generateSpecificBankSpecificCategoryReport(year, month, formValue.bank.value.code, this.categoryCode, selectedMonth, isAllBank, isAllCategory);
                    break;
                case 'specificBranchOrBranches':
                    const selectedBranchIds = formValue.selectedBranches;
                    if (selectedBranchIds.length === 0) {
                        this.toastService.showWarning('Please select at least one branch.');
                        return;
                    }
                    await this.generateReportForSelectedBranches(year, month, selectedBranchIds, selectedMonth);
                    break;
                default:
                    throw new Error('Invalid choice selected');
                }
            } catch (error) {
                console.error('Error generating report', error);
                this.toastService.showError('Error generating report');
            } finally {
                this.loading = false;
            }
        } else {
            console.error('Form is invalid');
        }
    }

    private async generateReportForSelectedBranches(year: number, month: number, selectedBranchIds: number[], selectedMonth: string) {
        try {
            console.log("The Branch array", selectedBranchIds);
            //This console log contains an array of branches that are select extract the id for each and then pass to the response
            //const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month, undefined, undefined, selectedBranchIds));
            // Call the PDF generation function
            //this.processBillsAndGeneratePdf(response.result, year, selectedMonth, false, false); // Adjust parameters as necessary
        } catch (error) {
            console.error('Error generating report for selected branches:', error);
            this.toastService.showError('Error generating report for selected branches');
        }
    }


    private async generateAllReport(year: number, month: number, selectedMonth: string, isAllBank: boolean, isAllCategory: boolean) {
        try {
            const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month));
            // Call without bankName
            this.processBillsAndGeneratePdf(response.result, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        }
    }

    // Repeat similar changes for the other report generation methods

    private async generateAllBankSpecificCategoryReport(year: number, month: number, categoryId: number, selectedMonth: string, isAllBank: boolean, isAllCategory: boolean) {
        try {
            const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month, categoryId));
            // Call without bankName
            this.processBillsAndGeneratePdf(response.result, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        }
    }

    private async generateSpecificBankAllCategoryReport(year: number, month: number, bankId: number, selectedMonth: string, isAllBank: boolean, isAllCategory: boolean) {
        try {
            const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month, undefined, bankId));
            // Call without bankName
            this.processBillsAndGeneratePdf(response.result, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        }
    }

    private async generateSpecificBankSpecificCategoryReport(year: number, month: number, bank: number, category: number, selectedMonth: string, isAllBank: boolean, isAllCategory: boolean) {
        try {
            const response = await firstValueFrom(this.pensionRegularBillService.getAllRegularPensionBills(year, month, category, bank));
            // Call without bankName
            this.processBillsAndGeneratePdf(response.result, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        }
    }

    private async processBillsAndGeneratePdf(bills: any, year: number, selectedMonth: string, isAllBank: boolean, isAllCategory: boolean) {
        if (!bills || bills.length === 0) {
            this.toastService.showWarning('No bills found');
            return;
        }

        try {
            this.fileGeneration.generatePdf(bills, year, selectedMonth, isAllBank, isAllCategory);
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.toastService.showError('Error generating PDF');
        }
    }
    showBankInput(): boolean {
        const choices = this.BillPrintForm.get('choices')?.value;
        return choices === 'specificBackAllCategory' || choices === 'specificBankSpecificCategory';
    }
    showBankForBranches(): boolean {
        return this.BillPrintForm.get('choices')?.value === 'specificBranchOrBranches';
    }
    showCategoryInput(): boolean {
        const choices = this.BillPrintForm.get('choices')?.value;
        return choices === 'allBankSpecificCategory' || choices === 'specificBankSpecificCategory';
    }
}