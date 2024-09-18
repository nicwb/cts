import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PensionBankAccountsService, BankService, PensionFactoryService, APIResponseStatus } from 'src/app/api';
import { firstValueFrom, tap } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { environment } from 'src/environments/environment';
import { log } from 'console';



@Component({
    selector: 'app-bank-details',
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit, OnChanges {
    BankDetailsForm: FormGroup = new FormGroup({});
    @Input() ppoId?: string;
    @Input() pensionerName?: string;
    banks: any = [];
    banksBranch?: any;
    isEditing: boolean = false;
    legend: string = "Bank Details";
    selectedBank: any = null;
    saveButton: boolean = false;

    constructor(
        private fb: FormBuilder,
        private service: PensionBankAccountsService,
        private banksService: BankService,
        private pensionFactoryService: PensionFactoryService,
        private tostService: ToastService,
    ) {
        this.initializeForm();
    }

    initializeForm() {
        this.BankDetailsForm = this.fb.group({
            payMode: ['Q'],
            bankAcNo: ['', [Validators.required]],
            accountHolderName: [''],
            ifscCode: ['', [Validators.required]],
            bankCode: ['', [Validators.required]],
            branchCode: ['', [Validators.required]],
            bank: new FormControl(''),
            bankName: ['']
        });
    }

    ngOnInit(): void {
        if (!environment.production) {
            this.fillFactoryData();
        }
        // Fetch banks and route parameters
        this.fetchBanks();

    }

    async fillFactoryData() {
        if (this.banks.length === 0) {
            await this.fetchBanks();
        }
        await firstValueFrom(this.pensionFactoryService.createFake("PensionerBankAcEntryDTO").pipe(
            tap(
                async (res) => {
                    if (res.result) {
                        this.BankDetailsForm.patchValue(res.result);

                        if (res.result.bankCode && this.banks.length > 0) {
                            const selectedBank = this.banks.find((bank: any) => bank.code === res.result.bankCode);

                            if (selectedBank) {
                                this.BankDetailsForm.patchValue({
                                    bankName: selectedBank.name,
                                    bank: selectedBank
                                });

                                await this.fetchAndPatchBranchName(res.result.bankCode, res.result.branchCode);
                            }
                        }
                    }
                }
            )
        ));
    }

    async fetchAndPatchBranchName(bankCode: number, branchCode: number) {
        await firstValueFrom(this.banksService.getBranchByBranchCode(bankCode).pipe(
            tap(response => {
                if (response.result) {
                    this.banksBranch = response.result;
                    const selectedBranch = this.banksBranch.find((branch: { code: number }) => branch.code === branchCode);
                    if (selectedBranch) {
                        this.BankDetailsForm.patchValue({ branchName: selectedBranch.name });
                    }
                }
            })
        ));
    }

    async fetchAndSetBankName(bankCode: number) {
        await firstValueFrom(
            this.banksService.getAllBanks().pipe(
                tap(response => {
                    if (response.result) {
                        const selectedBank = response.result.find(bank => bank.code === bankCode);
                        if (selectedBank) {
                            this.BankDetailsForm.patchValue({ bankName: selectedBank.name });
                        }
                    }
                })
            )
        );
    }

    async ngOnChanges(changes: SimpleChanges) {
        // Handle changes to @Input() properties
        if (changes['ppoId'] && this.ppoId) {
            this.legend = "ID-" + this.ppoId;
            await this.fetchUserInfo();
        }
        if (changes['pensionerName'] && this.pensionerName) {
            this.BankDetailsForm.patchValue({ accountHolderName: this.pensionerName });
        }
    }

    async fetchBanks() {
        await firstValueFrom(
            this.banksService.getAllBanks().pipe(
                tap(response => {
                    if (response.result) {
                        this.banks = response.result;
                    } else {
                        this.tostService.showWarning("No banks found");
                    }
                })
            )
        );
    }

    async fetchUserInfo() {
        if (!this.ppoId) return;
        try {
            await firstValueFrom(
                this.service.getBankAccountByPpoId(Number(this.ppoId)).pipe(
                    tap(async response => {
                        if (response.result) {
                            this.BankDetailsForm.patchValue(response.result);
                            this.isEditing = true;
                        }
                    })
                )
            );
        } catch (error) {
            console.error('Error fetching bank data', error);
        }
    }

    async onChangeBank(event: any) {
        if (event.value && event.value.code) {
            this.BankDetailsForm.patchValue({ bankCode: event.value.code });
            await firstValueFrom(this.banksService.getBranchesByBankCode(event.value.code).pipe(
                tap(response => {
                    if (response.result) {
                        this.banksBranch = response.result;
                    } else {
                        this.tostService.showWarning('No bank branches found');
                    }
                })
            ));
            // Update bankName form control value
            this.BankDetailsForm.get('bankName')?.setValue(event.value.name);
        } else {
            this.banksBranch = undefined;
        }
    }

    async onChangeBankBranch(event: any) {
        if (event.code) {
            this.BankDetailsForm.patchValue({ branchCode: event.code });
            await firstValueFrom(this.banksService.getBranchByBranchCode(event.code).pipe(
                tap(response => {
                    if (response.result) {
                        if (response.result.mircCode) {
                            this.BankDetailsForm.patchValue({ ifscCode: response.result.mircCode });
                        }
                    } else {
                        this.tostService.showWarning('No bank branch details found');
                    }
                })
            ));
        }
    }

    async saveData() {
        if (this.saveButton) {
            return;
        }

        if (!this.BankDetailsForm.valid) {
            this.tostService.showWarning("Fill all fields");
            return;
        }

        if (this.isEditing) {
            await firstValueFrom(this.service.updateBankAccountByPpoId(Number(this.ppoId), this.BankDetailsForm.value).pipe(
                tap(response => {
                    if (response.apiResponseStatus === APIResponseStatus.Success) {
                        this.tostService.showSuccess('Bank account updated successfully');
                    } else {
                        this.tostService.showWarning("Failed saving bank account");
                    }
                })
            ));
            return;
        }

        await firstValueFrom(this.service.createBankAccount(Number(this.ppoId), this.BankDetailsForm.value).pipe(
            tap(response => {
                if (response.apiResponseStatus === APIResponseStatus.Success) {
                    this.tostService.showSuccess('Bank account saved successfully');
                    this.isEditing=this.saveButton=true;
                    
                } else {
                    this.tostService.showWarning("Failed saving bank account");
                }
            })
        ));
    }
}
