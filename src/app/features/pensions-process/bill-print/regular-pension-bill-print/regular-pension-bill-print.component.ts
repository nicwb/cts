import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import {
    PensionRegularBillService,
    PensionBankBranchService,
    PensionCategoryMasterService,
    BankResponseDTO,
    BranchResponseDTO,
    BranchListResponseDTO,
} from 'src/app/api';
import { FileGenerationBillPrintService } from 'src/app/core/services/File_Generation_Bill_Print/file-generation-bill-print.service';
import { firstValueFrom, Observable, tap } from 'rxjs';

interface GenerateParams {
    year: number;
    month: number;
    categoryId?: number;
    bankId?: number;
    branchIds?: number[];
}

@Component({
    selector: 'app-regular-pension-bill-print',
    templateUrl: './regular-pension-bill-print.component.html',
    styleUrls: ['./regular-pension-bill-print.component.scss'],
})
export class RegularPensionBillPrintComponent implements OnInit {
    BillPrintForm: FormGroup = new FormGroup({});
    months: SelectItem[] = [];
    isGeneratingReport!: boolean;
    banksBranch: BranchListResponseDTO | null | undefined;
    banks: { label: string; value: BankResponseDTO }[] = [];
    categoryCode: number | undefined = undefined;
    categoryComponent$?: Observable<any>;
    selectedBranchIds: number[] | null = null;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastService,
        private fileGeneration: FileGenerationBillPrintService,
        private pensionRegularBillService: PensionRegularBillService,
        private bankService: PensionBankBranchService,
        private categoryService: PensionCategoryMasterService
    ) {}

    ngOnInit(): void {
        this.months = [
            {
                label: 'January',
                value: { id: 1, name: 'January', code: 'Jan' },
            },
            {
                label: 'February',
                value: { id: 2, name: 'February', code: 'Feb' },
            },
            { label: 'March', value: { id: 3, name: 'March', code: 'March' } },
            { label: 'April', value: { id: 4, name: 'April', code: 'April' } },
            { label: 'May', value: { id: 5, name: 'May', code: 'May' } },
            { label: 'June', value: { id: 6, name: 'June', code: 'June' } },
            { label: 'July', value: { id: 7, name: 'July', code: 'July' } },
            { label: 'August', value: { id: 8, name: 'August', code: 'Aug' } },
            {
                label: 'September',
                value: { id: 9, name: 'September', code: 'Sep' },
            },
            {
                label: 'October',
                value: { id: 10, name: 'October', code: 'Oct' },
            },
            {
                label: 'November',
                value: { id: 11, name: 'November', code: 'Nov' },
            },
            {
                label: 'December',
                value: { id: 12, name: 'December', code: 'Dec' },
            },
        ];

        const currentMonth = this.getCurrentMonth();

        this.BillPrintForm = this.fb.group({
            choices: ['', Validators.required],
            months: [currentMonth, Validators.required],
            year: [new Date(), Validators.required],
            bank: [''],
            category: [''],
            selectedBranches: [[], Validators.required],
        });

        this.categoryComponent$ = this.categoryService.getCategories();

        // Fetch banks
        this.fetchBanks();
        this.applyChoiceValidators();
    }

    applyChoiceValidators(): void {
        const choicesControl = this.BillPrintForm.get('choices');
        if (!choicesControl) {
            console.error('choicesControl is null or undefined');
            return;
        }

        firstValueFrom(
            choicesControl.valueChanges.pipe(
                tap(async (choice) => {
                    if (!choice) {
                        console.error('choice is null or undefined');
                        return;
                    }

                    try {
                        const bankControl =
                            this.BillPrintForm.get('bank') ?? null;
                        const categoryControl =
                            this.BillPrintForm.get('category') ?? null;
                        const selectedBranchesControl =
                            this.BillPrintForm.get('selectedBranches') ?? null;

                        bankControl?.clearValidators();
                        categoryControl?.clearValidators();

                        // Reset selected branches control value
                        this.BillPrintForm.patchValue({ selectedBranches: [] });

                        if (
                            choice === 'specificBackAllCategory' ||
                            choice === 'specificBankSpecificCategory'
                        ) {
                            bankControl?.setValidators([Validators.required]);
                            bankControl?.enable();
                        } else {
                            bankControl?.disable();
                        }

                        if (
                            choice === 'allBankSpecificCategory' ||
                            choice === 'specificBankSpecificCategory'
                        ) {
                            categoryControl?.setValidators([
                                Validators.required,
                            ]);
                            categoryControl?.enable();
                        } else {
                            categoryControl?.disable();
                        }

                        if (choice === 'specificBranchOrBranches') {
                            bankControl?.setValidators([Validators.required]);
                            bankControl?.enable();
                            selectedBranchesControl?.setValidators([
                                Validators.required,
                                Validators.minLength(1),
                            ]);
                            selectedBranchesControl?.enable();
                        } else {
                            selectedBranchesControl?.disable();
                            selectedBranchesControl?.clearValidators();
                        }

                        bankControl?.updateValueAndValidity();
                        categoryControl?.updateValueAndValidity();
                        selectedBranchesControl?.updateValueAndValidity();
                        this.BillPrintForm.updateValueAndValidity();
                    } catch (error) {
                        console.error('Error in applyChoiceValidators:', error);
                        this.toastService.showError(
                            'An error occurred while updating form validations'
                        );
                    }
                })
            )
        ).catch((error) => {
            console.error('Error in applyChoiceValidators:', error);
            this.toastService.showError(
                'An error occurred while updating form validations'
            );
        });
    }

    private getCurrentMonth(): any {
        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        const currentMonth = this.months.find(
            (month) => month.value.id === currentMonthIndex + 1
        );
        return currentMonth?.value ?? { id: 0, name: 'Unknown', code: 'UNK' }; // Default
    }

    private async fetchBanks() {
        try {
            const bankResponse = await firstValueFrom(
                this.bankService.getBanks()
            );
            if (
                bankResponse.apiResponseStatus === 'Success' &&
                bankResponse.result &&
                Array.isArray(bankResponse.result.banks)
            ) {
                if (bankResponse.result.banks.length === 0) {
                    this.toastService.showWarning('No banks found');
                } else {
                    this.banks = bankResponse.result.banks.map(
                        (bank: BankResponseDTO) => ({
                            label: bank.bankName ?? 'Default bank name',
                            value: bank,
                        })
                    );
                }
            } else {
                this.toastService.showWarning('No banks found');
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            this.toastService.showError('Error fetching banks');
        }
    }

    async onChangeBank(event: {
        value: { id: number; name: string; code: string };
    }) {
        if (event.value && event.value.code) {
            this.BillPrintForm.patchValue({ bankCode: event.value.id });
            try {
                const response = await firstValueFrom(
                    this.bankService.getBranchesByBankId(event.value.id).pipe(
                        tap((res) => {
                            if (res.result) {
                                this.banksBranch = res.result;
                            } else {
                                this.toastService.showWarning(
                                    'No bank branches found'
                                );
                            }
                        })
                    )
                );
                this.BillPrintForm.get('bankName')?.setValue(event.value.name);
            } catch (error) {
                console.error('Error fetching bank branches:', error);
                this.toastService.showError('Error fetching bank branches');
            }
        } else {
            this.banksBranch = undefined;
        }
    }

    onBranchChoiceChange() {
        // Reset selected branches whenever the choice changes
        const selectedBranchesControl = this.BillPrintForm.get(
            'selectedBranches'
        ) as FormArray;
        if (selectedBranchesControl) {
            selectedBranchesControl.clear();
        } else {
            console.warn('selectedBranchesControl is null or undefined');
        }
    }

    onChangeBankForBranches(event: { value: { value: { id: number } } }) {
        if (event.value && event.value.value && event.value.value.id) {
            const selectedBankId = event.value.value.id;
            this.fetchBranchesByBankId(selectedBankId);
        } else {
            this.banksBranch = { branches: [] };
        }
    }

    async fetchBranchesByBankId(bankId: number) {
        try {
            const response: any = await firstValueFrom(
                this.bankService.getBranchesByBankId(bankId)
            );
            if (response && response.result && response.result.branches) {
                this.banksBranch = response.result;
            } else {
                this.toastService.showWarning('No bank branches found');
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            this.toastService.showError('Error fetching branches');
        }
    }

    onBranchSelect(branch: BranchResponseDTO, isChecked: boolean) {
        const selectedBranchesControl = this.BillPrintForm.get(
            'selectedBranches'
        ) as FormArray;
        if (selectedBranchesControl) {
            if (isChecked) {
                selectedBranchesControl.push(new FormControl(branch.id)); // Add selected branch ID
            } else {
                const index = selectedBranchesControl.controls.findIndex(
                    (control) => control.value === branch.id
                );
                if (index >= 0) {
                    selectedBranchesControl.removeAt(index); // Remove unselected branch ID
                }
            }
        }
    }
    onBranchSelectChange(event: { value: number[] }) {
        this.selectedBranchIds = event.value; // Update selected branch IDs
    }

    handleCategorySearchEvent(event: { categoryName: string; id: number }) {
        if (event.categoryName && event.id) {
            this.BillPrintForm.controls['category'].setValue(
                event.categoryName
            );
            this.categoryCode = event.id;
        } else {
            console.error('Invalid category search event');
        }
    }

    onYearSelect(event: Date) {
        const selectedYear = event.getFullYear();
        if (!isNaN(selectedYear) && selectedYear >= 1 && selectedYear <= 9999) {
            this.BillPrintForm.patchValue({
                year: new Date(selectedYear, 0, 1),
            });
        } else {
            console.error('Invalid year selected');
        }
    }

    onRefresh(): void {
        this.BillPrintForm.reset();
        this.banksBranch = null;
    }

    async onGenerate(generation: string) {
        // Generate a report based on the form values
        if (!this.BillPrintForm.valid) {
            console.error('Form is invalid');
            return;
        }

        const formValue = this.BillPrintForm.value;
        const params: GenerateParams = {
            year: formValue.year.getFullYear(),
            month: formValue.months.id,
        };

        const selectedMonth = this.months.find(
            (m) => m.value.id === params.month
        )?.value.name;
        const isAllBank =
            formValue.choices === 'all' ||
            formValue.choices === 'allBankSpecificCategory';
        const isAllCategory =
            formValue.choices === 'all' ||
            formValue.choices === 'specificBackAllCategory';

        this.isGeneratingReport = true;

        try {
            // Add relevant parameters based on choice
            switch (formValue.choices) {
            case 'allBankSpecificCategory':
                params.categoryId = this.categoryCode;
                break;
            case 'specificBackAllCategory':
                params.bankId = formValue.bank.value.id;
                break;
            case 'specificBankSpecificCategory':
                params.bankId = formValue.bank.value.id;
                params.categoryId = this.categoryCode;
                break;
            case 'specificBranchOrBranches':
                const selectedBranchIds = formValue.selectedBranches.map(
                    (branch: { id: number }) => branch.id
                );
                if (selectedBranchIds.length === 0) {
                    this.toastService.showWarning(
                        'Please select at least one branch.'
                    );
                    return;
                }
                params.branchIds = selectedBranchIds;
                break;
            }

            await this.generateReport(
                params,
                selectedMonth,
                isAllBank,
                isAllCategory
            );
        } catch (error) {
            console.error('Error generating report:', error);
            this.toastService.showError('Error generating report');
        } finally {
            this.isGeneratingReport = false;
        }
    }

    private async generateReport(
        params: GenerateParams,
        selectedMonth: string,
        isAllBank: boolean,
        isAllCategory: boolean
    ) {
        try {
            const response = await firstValueFrom(
                this.pensionRegularBillService.getAllRegularPensionBills(
                    params.year,
                    params.month,
                    params.categoryId,
                    params.bankId,
                    params.branchIds
                )
            );

            if (
                !response ||
                !response.result ||
                !response.result.regularBills ||
                response.result.regularBills.length === 0
            ) {
                this.toastService.showWarning('No bills found');
                return;
            }

            await this.fileGeneration.generatePdf(
                response.result,
                params.year,
                selectedMonth,
                isAllBank,
                isAllCategory
            );
        } catch (error) {
            console.error('Error in report generation:', error);
            this.toastService.showError('Error generating report');
            throw error; // Re-throw to be caught by the caller
        }
    }
    shouldShowBankInputControl(): boolean {
        const choices = this.BillPrintForm.get('choices');
        if (!choices) {
            return false;
        }
        const selectedChoice = choices.value;
        return (
            selectedChoice === 'specificBackAllCategory' ||
            selectedChoice === 'specificBankSpecificCategory'
        );
    }

    shouldShowBankForBranchesControl(): boolean {
        const choices = this.BillPrintForm.get('choices');
        if (!choices) {
            return false;
        }
        const selectedChoice = choices.value;
        return selectedChoice === 'specificBranchOrBranches';
    }

    shouldShowCategoryInputControl(): boolean {
        const choices = this.BillPrintForm.get('choices');
        if (!choices) {
            return false;
        }
        const selectedChoice = choices.value;
        return (
            selectedChoice === 'allBankSpecificCategory' ||
            selectedChoice === 'specificBankSpecificCategory'
        );
    }
}
