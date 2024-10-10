import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { Validators } from '@angular/forms';
import { Payload } from 'src/app/core/models/search-query';
import { formatDate } from '@angular/common';
import {
    PensionManualPPOReceiptService,
    PensionPPODetailsService,
    PensionCategoryMasterService,
    ListAllPpoReceiptsResponseDTO,
    APIResponseStatus,
    PensionBankBranchService
} from 'src/app/api';
import {
    firstValueFrom,
    Observable,
    Subscription,
    tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PensionFactoryService } from 'src/app/api';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnChanges {
    religionOptions: SelectItem[];
    subDivOptions: SelectItem[];
    ppoFormDetails: FormGroup = new FormGroup({});
    ManualEntrySearchForm: FormGroup = new FormGroup({});
    allManualPPOReceipt$?: Observable<any>;
    catDescription$?: Observable<any>;
    eppoid?: any;
    categoryDescriptionFelid: string = '';
    @Input() ppoId?: string | undefined | null;
    @Output() return = new EventEmitter();
    @Output() returnBank = new EventEmitter();
    legend: string = 'PPO Details';
    sechButtonStyle = { height: '267%' };
    pensionerName: any;
    banks: any = [];
    banksBranch: any[] = [];
    hasBranches: boolean = false;
    isEditing: boolean = false;
    selectedBank: any = null;
    returnUri: string | null = null;
    saveButton: boolean = false;

    constructor(
        private fb: FormBuilder,
        private PensionManualPPOReceiptService: PensionManualPPOReceiptService,
        private ppoCategoryService: PensionCategoryMasterService,
        private PensionPPODetailsService: PensionPPODetailsService,
        private tostService: ToastService,
        private factoryService: PensionFactoryService,
        private pensionBankBranchService: PensionBankBranchService,
        private router: Router
    ) {
        this.ininalizer();
        this.religionOptions = [
            { label: 'Hindu', value: 'H' },
            { label: 'Muslim', value: 'M' },
            { label: 'Other', value: 'O' },
        ];

        this.subDivOptions = [
            { label: 'Employed', value: 'E' },
            { label: 'Widow Daughter', value: 'L' },
            { label: 'Unmarried Daughter', value: 'U' },
            { label: 'Divorced Daughter', value: 'V' },
            { label: 'Minor Son', value: 'N' },
            { label: 'Minor Daughter', value: 'R' },
            { label: 'Handicapped Son', value: 'P' },
            { label: 'Handicapped Daughter', value: 'G' },
            { label: 'Dependent Father', value: 'J' },
            { label: 'Dependent Mother', value: 'K' },
            { label: 'Wife', value: 'W' },
        ];
    }
    async ngOnInit() {
        if (!environment.production && !this.ppoId) {
            await this.factory();
        }
    }

    async getFakePensionerData(ppoReceipt: ListAllPpoReceiptsResponseDTO) {
        await firstValueFrom(
            this.factoryService.createFake('PensionerEntryDTO').pipe(
                tap(async (res) => {
                    if (res.result) {
                        this.patchData(res.result); // Patch the pensioner data to the form
                        this.handelManualEntrySelect(ppoReceipt);
                        this.fetchCatDescription();
                        this.setCat();

                        // Fetch branches for the bank using bankId
                        const bankId = res.result.bankId;// Fetch branches based on bankId

                        // Set the selected branch using branchId from the pensioner data
                        const branchId = res.result.branchId;
                        const selectedBranch = this.banksBranch.find((branch: { id: number }) => branch.id === branchId);
                        if (selectedBranch) {
                            this.ppoFormDetails.patchValue({
                                bankBranch: selectedBranch.id, // Set the branch ID
                                ifscCode: selectedBranch.ifscCode // Set the IFSC code
                            });
                        }
                    }
                })
            )
        );
    }

    async factory() {
        await firstValueFrom(this.PensionManualPPOReceiptService.getAllUnusedPpoReceipts().pipe(
            tap(
                res => {
                    if (res.result?.dataCount == 0) {
                        Swal.fire({
                            icon: "info",
                            title: "No manual ppo receipt found!. Do you want add it?",
                            showDenyButton: true,
                            confirmButtonText: "Yes",
                            denyButtonText: "No"
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                this.router.navigate(["ppo/ppo-receipt"], {
                                    queryParams: { returnUri: 'ppo/entry/new' }
                                });
                            }else{
                                this.router.navigate(["ppo/entry"]);
                            }
                        });
                        return;
                    }
                    if (res.result?.data) {
                        this.getFakePensionerData(res.result?.data[0]);
                    }
                }
            )
        ))
    }

    async fetchBanks() {
        try {
            const response = await firstValueFrom(this.pensionBankBranchService.getBanks());
            if (response.apiResponseStatus === 'Success' && response.result) {
                this.banks = response.result.banks?.map((bank: any) => ({
                    label: bank.bankName,
                    value: bank.id,
                }));
            } else {
                this.tostService.showError(response.message || 'Failed to fetch banks');
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            this.tostService.showError('An error occurred while fetching banks');
        }
    }

    ngOnChanges(): void {
        if (this.ppoId) {
            this.legend = 'ID-' + this.ppoId;
        }
    }

    ininalizer(): void {
        this.ppoFormDetails = this.fb.group({
            receiptId: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            ppoNo: [null, [Validators.maxLength(100), Validators.minLength(0)]], /// null
            ppoId: [null, []],
            pensionerName: [
                null,
                [Validators.maxLength(100), Validators.minLength(0)],
            ], // null
            ppoType: [
                'P',
                [Validators.required, Validators.pattern('^[PFC]$')],
            ],
            ppoSubType: [
                'E',
                [Validators.required, Validators.pattern('^[ELUVNRPGJKHW]$')],
            ],
            categoryId: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            dateOfRetirement: [this.getFirstDateOfCurrentMonth()],
            dateOfCommencement: [this.getFirstDateOfCurrentMonth()], // -->> api
            basicPensionAmount: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            commutedPensionAmount: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            effectFrom : [null, []],
            uptoDate: [null, []],
            reducedPensionAmount: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            mobileNumber: [null, [Validators.pattern(/^[6-9]\d{9}$/)]], // null
            aadhaarNo: [null, [Validators.required, this.aadhaarValidator]], // null
            panNo: [null, [Validators.required, this.panValidator]], // null
            gender: ['M', [Validators.pattern('^[MFO]$')]], // null
            dateOfBirth: [null, [Validators.required]],
            religion: [
                'H',
                [Validators.required, Validators.pattern('^[HMO]$')],
            ],
            emailId: [null, [Validators.email]], // null
            identificationMark: [null], // null
            enhancePensionAmount: [
                '1001',
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            pensionerAddress: [null], // null

            // additional
            retirementDate: [this.getFirstDateOfCurrentMonth()],
            subCatDesc: [null],
            categoryIdShow: [null],
            categoryDescription: [null],

            //
            effectiveDate: [this.getFirstDateOfCurrentMonth()],
            payMode: ['Q'],
            bankAcNo: ['', [Validators.required]],
            accountHolderName: [''],
            ifscCode: ['', [Validators.required]],
            bank: ['', Validators.required],
            bankBranch: [null, Validators.required]
        });
    }


    onChangeBankBranch(event: any): void {
        const selectedBranch = event.value;
        if (selectedBranch) {
            const branch = this.banksBranch.find((b: any) => b.id === selectedBranch.id);
            if (branch) {
                this.ppoFormDetails.patchValue({
                    bankBranch: branch.id,
                    ifscCode: branch.ifscCode
                });
            } else {
                console.error('Selected branch not found in branches list');
                this.tostService.showError('Error selecting branch');
            }
        } else {
            this.ppoFormDetails.patchValue({
                bankBranch: { id: null, label: null },
                ifscCode: null
            });
        }
    }


    async fetchBankDetails(branchId: number): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.pensionBankBranchService.getBranchesByBankId(branchId)
            );
            if (response.apiResponseStatus === 'Success' && response.result) {
                const branch = response.result?.branches?.[0];
                if (branch) {
                    return {
                        ifscCode: branch.ifscCode
                    };
                } else {
                    console.error('No valid branch found for branchId:', branchId);
                    this.tostService.showError('Bank branch details not found');
                    return null;
                }
            }
            console.error('Failed to fetch bank details for branchId:', branchId);
            this.tostService.showError('Failed to fetch bank details');
            return null;
        } catch (error) {
            console.error('Error fetching bank details:', error);
            this.tostService.showError('An error occurred while fetching bank details');
            throw error;
        }
    }

    panValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // PAN format: 5 letters, 4 digits, 1 letter
        if (control.value && !PAN_REGEX.test(control.value)) {
            return { invalidPan: true };
        }
        return null;
    }

    aadhaarValidator(
        control: AbstractControl
    ): { [key: string]: boolean } | null {
        const AADHAAR_REGEX = /^\d{12}$/; // AADHAAR is a 12-digit number
        if (control.value && !AADHAAR_REGEX.test(control.value)) {
            return { invalidAadhaar: true };
        }
        return null;
    }

    async fetchPpoDetails() {
        if (this.ppoId) {
            await firstValueFrom(
                this.PensionPPODetailsService.getPensionerByPpoId(
                    Number(this.ppoId)
                ).pipe(
                    tap((res) => {
                        if (res.apiResponseStatus == "Success" && res.result) {
                            this.patchData(res.result);
                            if (res.result.category) {
                                this.handelCategoryDescription(res.result.category)
                            }
                        } else {
                            if (res.message) {
                                this.tostService.showError(res.message);
                            }
                        }
                    })
                )
            );
        }
    }
    // this function do date object to string
    getFormattedDate(date: Date | null): string {
        if (date) {
            return formatDate(date, 'yyyy-MM-dd', 'en-US');
        }
        return '';
    }

    // convert string to date object
    parseDate(dateString: string): Date | null {
        // Check if the dateString matches the yyyy-MM-dd format
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) {
            return null; // Invalid date format
        }

        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // Months are 0-indexed in JavaScript
    }

    parseToDate(dateOnly: any): Date | null {
        if (!dateOnly) return null;
        if (dateOnly instanceof Date) return dateOnly;
        const parsedDate = new Date(dateOnly);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // make this all data objet to string formate yy-mm-dd
    formateDate(): void {
        this.ppoFormDetails.controls['dateOfRetirement'].setValue(
            this.getFormattedDate(
                this.ppoFormDetails.get('dateOfRetirement')?.value
            )
        );
        this.ppoFormDetails.controls['dateOfCommencement'].setValue(
            this.getFormattedDate(
                this.ppoFormDetails.get('dateOfCommencement')?.value
            )
        );
        this.ppoFormDetails.controls['effectiveDate'].setValue(
            this.getFormattedDate(
                this.ppoFormDetails.get('effectiveDate')?.value
            )
        );
        this.ppoFormDetails.controls['dateOfBirth'].setValue(
            this.getFormattedDate(this.ppoFormDetails.get('dateOfBirth')?.value)
        );
    }

    // remove that fild not required for server
    removeNotrequiredField(): void {
        // this.ppoFormDetails.removeControl('categoryDescription');
        // this.ppoFormDetails.removeControl('categoryIdShow');
        // this.ppoFormDetails.removeControl('subCatDesc');
        // this.ppoFormDetails.removeControl('effectiveDate');
        // this.ppoFormDetails.removeControl('reducedPensionAmount');
    }

    // call this method for save database
    async saveData() {
        if (this.saveButton) {
            return;
        }
        this.saveButton = true;

        if (!this.ppoId) {
            try {
                this.formateDate();
            } catch (error) {
                console.error(error);
            }
        } else {
            this.ppoFormDetails.removeControl('retirementDate');
            this.ppoFormDetails.removeControl('reducedPensionAmount');
        }

        const selectedBankBranch = this.ppoFormDetails.get('bankBranch')?.value;
        const selectedBank = this.ppoFormDetails.get('bank')?.value;

        if (selectedBankBranch) {
            const branchId = selectedBankBranch.value;
            this.ppoFormDetails.patchValue({ branchId });
        }

        if (selectedBank) {
            const bankId = selectedBank.value;
            this.ppoFormDetails.patchValue({ bankId });
        }
        if (this.ppoFormDetails.invalid) {
            Object.keys(this.ppoFormDetails.controls).forEach(key => {
                const control = this.ppoFormDetails.get(key);
                if (control && control.invalid) {
                }
            });
        }
        if (this.ppoFormDetails.valid || this.ppoId) {
            const formValue = this.ppoFormDetails.value;
            formValue.branchId = formValue.bankBranch;
            if (!this.ppoId) {
                await firstValueFrom(
                    this.PensionPPODetailsService.createPensioner(
                        formValue
                    ).pipe(
                        tap(
                            (res) => {
                                if (res.apiResponseStatus == APIResponseStatus.Success) {
                                    if (res.message) {
                                        this.tostService.showSuccess(
                                            res.message
                                        );
                                    }
                                    if (res.result?.ppoId) {
                                        this.ppoId = String(res.result.ppoId);
                                        this.ppoFormDetails.controls['ppoId'].setValue(this.ppoId);
                                        this.pensionerName = String(
                                            res.result.pensionerName
                                        );
                                        this.return.emit([
                                            this.ppoId,
                                            this.pensionerName,
                                        ]);
                                        this.saveButton = true;
                                    }
                                } else {
                                    if (res.message) {
                                        this.tostService.showError(res.message);
                                    }
                                }
                            }
                        )
                    )
                );
                return;
            } else {
                this.formateDate();
            }
            // when it want update
            await firstValueFrom(
                this.PensionPPODetailsService.updatePensionerByPpoId(
                    Number(this.ppoId),
                    formValue
                ).pipe(
                    tap(
                        (res) => {
                            if (res.apiResponseStatus == "Success") {
                                if (res.message) {
                                    this.tostService.showSuccess(res.message);
                                }
                                this.patchData(res.result)

                            }
                        }
                    )
                )
            );
            return;
        }
        this.tostService.showError('Please fill all required fields');
    }


    // manual PPO entry search
    MEDetailsSearch(): void {
        this.allManualPPOReceipt$ =
            this.PensionManualPPOReceiptService.getAllUnusedPpoReceipts();
    }

    // handelManualEntrySelectRow
    handelManualEntrySelect($event: any) {
        this.ppoFormDetails.controls['receiptId'].setValue($event.id);
        this.ppoFormDetails.controls['pensionerName'].setValue(
            $event.pensionerName
        );
        this.ppoFormDetails.controls['ppoNo'].setValue($event.ppoNo);
        this.ppoFormDetails.controls['dateOfCommencement'].setValue(
            this.parseToDate($event.dateOfCommencement)
        );
        this.eppoid = $event.treasuryReceiptNo;
    }

    // fetch CatDescription
    async fetchCatDescription(): Promise<void> {
        // get cat discription
        let payload: Payload = {
            pageSize: 10,
            pageIndex: 0,
            filterParameters: [],
            sortParameters: { field: '', order: '' },
        };

        const CatDescription = this.ppoFormDetails.get(
            'categoryDescription'
        )?.value;
        // if (CatDescription) {
        //     payload.filterParameters = [
        //         {
        //             field: 'primaryCategoryId',
        //             value: CatDescription,
        //             operator: 'contains',
        //         },
        //     ];
        // }
        this.catDescription$ =
            this.ppoCategoryService.getAllCategories(payload);
    }

    // handelCategoryDescription
    handelCategoryDescription($event: any) {
        if ($event) {
            this.ppoFormDetails.controls['categoryDescription'].setValue(
                $event.categoryName
            );
            this.ppoFormDetails.controls['categoryIdShow'].setValue(
                $event.primaryCategoryId
            );
            this.ppoFormDetails.controls['subCatDesc'].setValue(
                $event.subCategoryId
            );
            this.ppoFormDetails.controls['categoryId'].setValue($event.id);
        }
    }

    async patchData(data: any) {
        // Convert date strings to Date objects
        ['dateOfRetirement', 'dateOfCommencement', 'dateOfBirth'].forEach(dateField => {
            if (data[dateField]) {
                data[dateField] = this.parseDate(data[dateField]);
            }
        });

        this.ppoFormDetails.patchValue(data);

        // Fetch banks and select the correct one
        await this.fetchBanks();
        if (data.bankId) {
            this.ppoFormDetails.patchValue({ bank: data.bankId });
            await this.onChangeBank({ value: data.bankId });

            // Find the branch with the ID that matches the bankBranch field
            const branch = this.banksBranch.find((b: any) => b.id === data.branchId);
            if (branch) {

                this.ppoFormDetails.patchValue({
                    bankBranch: branch.id, // Update the correct form control
                    ifscCode: branch.ifscCode,
                    branchName: branch.label // Set the branch name
                });

            } else {
                console.error('No valid branch found for branchId:', data.branchId);
                this.tostService.showError('Bank branch details not found');
            }
        }
    }

    async onChangeBank(event: any): Promise<void> {
        const selectedBank = event.value;
        if (selectedBank) {
            await this.fetchBranchesByBankId(selectedBank);

            // If we have a branchId from the initial data, select it
            const initialBranchId = this.ppoFormDetails.get('bankBranch')?.value;
            if (initialBranchId) {
                const branch = this.banksBranch.find((b: any) => b.id === initialBranchId);
                if (branch) {
                    this.ppoFormDetails.patchValue({
                        bankBranch: branch.id, // Update the correct form control
                        ifscCode: branch.ifscCode
                    });
                } else {
                    console.error('No valid branch found for branchId:', initialBranchId);
                    this.tostService.showError('Bank branch details not found');
                }
            } else {
                // If no initial branchId is found, set the first branch as default
                if (this.banksBranch.length > 0) {
                    const defaultBranch = this.banksBranch[0];
                    this.ppoFormDetails.patchValue({
                        bankBranch: defaultBranch.id,
                        ifscCode: defaultBranch.ifscCode
                    });
                }
            }
            this.hasBranches = this.banksBranch.length > 0; // Update the hasBranches flag
        } else {
            this.banksBranch = [];
            this.hasBranches = false; // Update the hasBranches flag
        }
    }

    async fetchBranchesByBankId(bankId: number): Promise<void> {
        try {
            const response = await firstValueFrom(this.pensionBankBranchService.getBranchesByBankId(bankId));
            if (response.apiResponseStatus === 'Success' && response.result && response.result.branches) {
                this.banksBranch = response.result.branches.map((branch: any) => ({
                    id: branch.id,
                    label: branch.branchName, // Use branchName as the label
                    ifscCode: branch.ifscCode,
                }));
                this.hasBranches = this.banksBranch.length > 0; // Update the hasBranches flag
            } else {
                this.banksBranch = []; // or some other default value
                this.hasBranches = false; // Update the hasBranches flag
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            this.tostService.showError('An error occurred while fetching branches');
        }
    }

    getFirstDateOfCurrentMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // fetchAll cat dep
    async   setCat(){
        if (this.ppoFormDetails.get('categoryId')?.value) {
            await firstValueFrom(
                this.ppoCategoryService.getCategoryById(this.ppoFormDetails.get('categoryId')?.value).pipe(
                    tap(
                        res =>{
                            if (res.result) {
                                this.handelCategoryDescription(res.result)
                            }
                        }
                    )
                )
            );
        }
    }


}