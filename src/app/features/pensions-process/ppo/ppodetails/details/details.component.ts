import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { Validators } from '@angular/forms';
import { Payload } from 'src/app/core/models/search-query';
import { formatDate } from '@angular/common';
import {
    PensionManualPPOReceiptService,
    PensionPPODetailsService,
    PensionCategoryMasterService,
    ListAllPpoReceiptsResponseDTO,
    APIResponseStatus,
    PensionBankBranchService,
    PensionStatusDTOJsonAPIResponse,
    PensionPPOStatusService,
    PensionStatusFlag,
} from 'src/app/api';
import { async, firstValueFrom, Observable, Subscription, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PensionFactoryService } from 'src/app/api';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ppid } from 'process';
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

    isInputshow: boolean = false;
    isEditMode: boolean = false; // Track whether it's edit mode
    // SharedPension: boolean = false; // Track whether
    // InterimAllowance: boolean = false; //
    // ProvisionalPension: boolean = false; //
    // AdhocPension: boolean = false; // Track
    // DoublePension: boolean = false; //
    // SubDiv = [
    //     { label: 'Select Sub Division', value: '' },
    //     { label: 'Sub Division 1', value: 'Sub Division 1' },
    //     { label: 'Sub Division 2', value: 'Sub Division 2' },
    //     { label: 'Sub Division 3', value: 'Sub Division 3' },
    // ];
    // ReEmployeed: boolean = false;
    // EmployeedPensioner: boolean = false;
    // HealthScheme: boolean = false;
    FirstPensionGenerated: boolean = false;
    ApprovalFlag!: boolean | null | string;
    pensionerStatus: string = 'NONE';
    PPOApproveDate: string = 'NONE';

    constructor(
        private fb: FormBuilder,
        private PensionManualPPOReceiptService: PensionManualPPOReceiptService,
        private ppoCategoryService: PensionCategoryMasterService,
        private PensionPPODetailsService: PensionPPODetailsService,
        private tostService: ToastService,
        private factoryService: PensionFactoryService,
        private pensionBankBranchService: PensionBankBranchService,
        private SessionStorageService: SessionStorageService,

        private router: Router,

        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private statusService: PensionPPOStatusService
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

        this.route.paramMap.subscribe((params) => {
            this.ppoId = params.get('ppoId') || undefined;
            if (this.ppoId) {
                const ppoidNumber = Number(this.ppoId);
                this.getData(ppoidNumber);
                this.ppoStatus(ppoidNumber);
            }
        });
        this.MEDetailsSearch();
        this.getReceipt();
        this.checkIfEditModeFromUrl();
        this.fetchCatDescription();
    }

    async getFakePensionerData(ppoReceipt: ListAllPpoReceiptsResponseDTO) {
        await firstValueFrom(
            this.factoryService.createFake('PensionerEntryDTO').pipe(
                tap(async (res) => {
                    if (res.result) {
                        // console.log("date 2",res.result)
                        this.patchData(res.result); // Patch the pensioner data to the form
                        this.handelManualEntrySelect(ppoReceipt);
                        this.fetchCatDescription();
                        this.setCat();

                        // Fetch branches for the bank using bankId
                        const bankId = res.result.bankId; // Fetch branches based on bankId

                        // Set the selected branch using branchId from the pensioner data
                        const branchId = res.result.branchId;
                        const selectedBranch = this.banksBranch.find(
                            (branch: { id: number }) => branch.id === branchId
                        );
                        if (selectedBranch) {
                            this.ppoFormDetails.patchValue({
                                bankBranch: selectedBranch.id, // Set the branch ID
                                ifscCode: selectedBranch.ifscCode, // Set the IFSC code
                            });
                        }
                    }
                })
            )
        );
    }

    async getReceipt() {
        const fullPath = this.router.url;
        if (fullPath === '/pension-process/ppo/entry/new') {
            await firstValueFrom(
                this.PensionManualPPOReceiptService.getAllUnusedPpoReceipts().pipe(
                    tap((res) => {
                        if (res.result?.dataCount == 0) {
                            void Swal.fire({
                                icon: 'info',
                                title: 'No manual ppo receipt found!. Do you want add it?',
                                showDenyButton: true,
                                confirmButtonText: 'Yes',
                                denyButtonText: 'No',
                            }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    void this.router.navigate(
                                        ['pension-process/ppo/ppo-receipt/new'],
                                        {
                                            queryParams: {
                                                returnUri:
                                                    'pension-process/ppo/entry/new',
                                            },
                                        }
                                    );
                                } else {
                                    void this.router.navigate([
                                        'pension-process/ppo/entry',
                                    ]);
                                }
                            });
                            return;
                        }
                    })
                )
            );
        }
    }

    async factory() {
        await firstValueFrom(
            this.PensionManualPPOReceiptService.getAllUnusedPpoReceipts().pipe(
                tap((res) => {
                    if (res.result?.dataCount == 0) {
                        void Swal.fire({
                            icon: 'info',
                            title: 'No manual ppo receipt found!. Do you want add it?',
                            showDenyButton: true,
                            confirmButtonText: 'Yes',
                            denyButtonText: 'No',
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                void this.router.navigate(
                                    ['pension-process/ppo/ppo-receipt/new'],
                                    {
                                        queryParams: {
                                            returnUri:
                                                'pension-process/ppo/entry/new',
                                        },
                                    }
                                );
                            } else {
                                void this.router.navigate([
                                    'pension-process/ppo/entry',
                                ]);
                            }
                        });
                        return;
                    }
                    if (res.result?.data) {
                        void this.getFakePensionerData(res.result?.data[0]);
                    }
                })
            )
        );
    }

    async fetchBanks() {
        try {
            const response = await firstValueFrom(
                this.pensionBankBranchService.getBanks()
            );
            if (response.apiResponseStatus === 'Success' && response.result) {
                this.banks = response.result.banks?.map((bank: any) => ({
                    label: bank.bankName,
                    value: bank.id,
                }));
            } else {
                this.tostService.showError(
                    response.message || 'Failed to fetch banks'
                );
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            this.tostService.showError(
                'An error occurred while fetching banks'
            );
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
            id: [null, [Validators.maxLength(100), Validators.minLength(0)]], /// null
            ppoNo: [null, [Validators.maxLength(100), Validators.minLength(0)]], /// null
            ppoId: [null, []],
            pensionerName: [
                null,
                [Validators.maxLength(100), Validators.minLength(0)],
            ], // null
            ppoType: ['', [Validators.required, Validators.pattern('^[PFC]$')]],
            ppoSubType: [
                '',
                [Validators.required, Validators.pattern('^[ELUVNRPGJKHW]$')],
            ],
            categoryId: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            dateOfRetirement: [this.getFirstDateOfCurrentMonth()],
            dateOfCommencement: ['', Validators.required],
            basicPensionAmount: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            commutedPensionAmount: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            effectFrom: [null, []],
            uptoDate: [null, []],
            reducedPensionAmount: [
                null,
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            mobileNumber: [null, [Validators.pattern(/^[6-9]\d{9}$/)]], // null
            aadhaarNo: [null, [Validators.required, this.aadhaarValidator]], // null
            panNo: [null, [Validators.required, this.panValidator]], // null
            gender: ['', [Validators.pattern('^[MFO]$')]], // null
            dateOfBirth: [null],
            dateOfDeath: [null, Validators.required],
            religion: [
                '',
                [Validators.required, Validators.pattern('^[HMO]$')],
            ],
            emailId: [null, [Validators.email]], // null
            identificationMark: [null], // null
            enhancePensionAmount: [
                '1001',
                [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            pensionerAddress: [null, Validators.required], // null

            // additional
            retirementDate: [this.getFirstDateOfCurrentMonth()],
            subCatDesc: [null],
            categoryIdShow: [null],
            categoryDescription: [null],

            //
            effectiveDate: [this.getFirstDateOfCurrentMonth()],
            payMode: ['', [Validators.required]],
            bankAcNo: ['', [Validators.required]],
            accountHolderName: [''],
            ifscCode: ['', [Validators.required]],
            bank: ['', Validators.required],
            bankBranch: [null, Validators.required],
            efpAmount: [null],
            efpWefDate: [this.getFirstDateOfCurrentMonth()],
            efpUptoDate: [this.getFirstDateOfCurrentMonth()],
            nfpAmount: [null],
            nfpWefDate: [this.getFirstDateOfCurrentMonth()],
            notionalPensionAmount: [null],
            notionalWefDate: [''],
            gpfTpfNo: [''],
            healthScheme: [null],
            employedPensioner: [null],
            reEmployedPensioner: [null],
            doublePension: [false, ],
            adhocPension: [false, ],
            provisionalPension: [false, ],
            interimAllowance: [false, ],
            sharedPension: [false, ],
            remarks: ['',],
        });
    }

    clicked() {
        console.log(this.ppoFormDetails.get('healthScheme')?.value);
    }
    onChangeBankBranch(event: any): void {
        const selectedBranchId = event.value; // Selected branch ID

        if (selectedBranchId) {
            const branch = this.banksBranch.find(
                (b: any) => b.id === selectedBranchId
            );

            if (branch) {
                // Patch the form with the branch details
                this.ppoFormDetails.patchValue({
                    bankBranch: branch.id,
                    ifscCode: branch.ifscCode,
                });
            } else {
                // console.error('Selected branch not found in the list');
                // this.tostService.showError('Error: Selected branch not found');
            }
        } else {
            // Clear the branch and IFSC code fields if no branch is selected
            this.ppoFormDetails.patchValue({
                bankBranch: null,
                ifscCode: null,
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
                        ifscCode: branch.ifscCode,
                    };
                } else {
                    console.error(
                        'No valid branch found for branchId:',
                        branchId
                    );
                    this.tostService.showError('Bank branch details not found');
                    return null;
                }
            }
            console.error(
                'Failed to fetch bank details for branchId:',
                branchId
            );
            this.tostService.showError('Failed to fetch bank details');
            return null;
        } catch (error) {
            console.error('Error fetching bank details:', error);
            this.tostService.showError(
                'An error occurred while fetching bank details'
            );
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
        this.ppoFormDetails.controls['dateOfDeath'].setValue(
            this.getFormattedDate(this.ppoFormDetails.get('dateOfDeath')?.value)
        );
        this.ppoFormDetails.controls['effectFrom'].setValue(
            this.getFormattedDate(this.ppoFormDetails.get('effectFrom')?.value)
        );
        this.ppoFormDetails.controls['uptoDate'].setValue(
            this.getFormattedDate(this.ppoFormDetails.get('uptoDate')?.value)
        );
        this.ppoFormDetails.controls['retirementDate'].setValue(
            this.getFormattedDate(
                this.ppoFormDetails.get('retirementDate')?.value
            )
        );
    }
    formatRadioButton() {
        this.ppoFormDetails.controls['reEmployedPensioner'].setValue(
            Boolean(this.ppoFormDetails.get('reEmployedPensioner')?.value)
        );
        this.ppoFormDetails.controls['employedPensioner'].setValue(
            Boolean(this.ppoFormDetails.get('employedPensioner')?.value)
        );
        this.ppoFormDetails.controls['healthScheme'].setValue(
            Boolean(this.ppoFormDetails.get('healthScheme')?.value)
        );
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
                this.formatRadioButton();
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
            Object.keys(this.ppoFormDetails.controls).forEach((key) => {
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
                        tap((res) => {
                            if (
                                res.apiResponseStatus ==
                                APIResponseStatus.Success
                            ) {
                                if (res.message) {
                                    this.tostService.showSuccess(res.message);
                                    this.router.navigate(
                                        [
                                            'pension-process/ppo',
                                            res.result?.ppoId,
                                            'edit',
                                        ],
                                        {
                                            queryParams: { step: 0 },
                                        }
                                    );
                                }
                                this.SessionStorageService.remove(
                                    '',
                                    '',
                                    `ppoDetails`
                                );
                                if (res.result?.ppoId) {
                                    this.ppoId = String(res.result.ppoId);
                                    const id = String(res.result.id);

                                    if (this.ppoFormDetails.get('ppoId')) {
                                        this.ppoFormDetails
                                            .get('ppoId')
                                            ?.setValue(this.ppoId);
                                    }

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
                        })
                    )
                );
                return;
            } else {
                this.formateDate();
                this.formatRadioButton();
            }
            // when it want update
            await firstValueFrom(
                this.PensionPPODetailsService.updatePensionerByPpoId(
                    Number(this.ppoId),
                    formValue
                ).pipe(
                    tap((res) => {
                        if (res.apiResponseStatus == 'Success') {
                            /// tor id gulo ki ki bol?
                            if (res.message) {
                                this.tostService.showSuccess(res.message);
                            }
                            this.patchData(res.result);
                        }
                    })
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
        if ($event.treasuryReceiptNo == null) {
            this.isInputshow = true;
        }
        this.ppoFormDetails.controls['pensionerName'].setValue(
            $event.pensionerName
        );
        this.ppoFormDetails.controls['ppoNo'].setValue($event.ppoNo);
        this.ppoFormDetails.controls['dateOfCommencement'].setValue(
            this.parseToDate($event.dateOfCommencement)
        );
        this.ppoFormDetails.controls['mobileNumber'].setValue(
            $event.mobileNumber
        );
        this.eppoid = $event.treasuryReceiptNo;
    }

    // fetch CatDescription
    async fetchCatDescription(): Promise<void> {
        this.catDescription$ = this.ppoCategoryService.getCategories();
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
        ['dateOfRetirement', 'dateOfCommencement', 'dateOfBirth'].forEach(
            (dateField) => {
                if (data[dateField]) {
                    data[dateField] = this.parseDate(data[dateField]);
                }
            }
        );

        this.ppoFormDetails.patchValue(data);
        this.ppoFormDetails.controls['dateOfDeath'].setValue(
            this.ppoFormDetails.get('dateOfBirth')?.value
        );

        // Fetch banks and select the correct one
        await this.fetchBanks();
        if (data.bankId) {
            this.ppoFormDetails.patchValue({ bank: data.bankId });
            await this.onChangeBank({ value: data.bankId });
            if (data.bankId) {
                data.branchId = this.banksBranch[0].id;
            }

            // Find the branch with the ID that matches the bankBranch field
            const branch = this.banksBranch.find(
                (b: any) => b.id === data.branchId
            );
            if (branch) {
                this.ppoFormDetails.patchValue({
                    bankBranch: branch.id, // Update the correct form control
                    ifscCode: branch.ifscCode,
                    branchName: branch.label, // Set the branch name
                });
            } else {
                console.error(
                    'No valid branch found for branchId:',
                    data.branchId
                );
                this.tostService.showError('Bank branch details not found');
            }
        }
    }

    async onChangeBank(event: any): Promise<void> {
        const selectedBank = event.value;
        if (selectedBank) {
            await this.fetchBranchesByBankId(selectedBank);

            // If we have a branchId from the initial data, select it
            const initialBranchId =
                this.ppoFormDetails.get('bankBranch')?.value;
            if (initialBranchId) {
                const branch = this.banksBranch.find(
                    (b: any) => b.id === initialBranchId
                );
                if (branch) {
                    this.ppoFormDetails.patchValue({
                        bankBranch: branch.id, // Update the correct form control
                        ifscCode: branch.ifscCode,
                    });
                } else {
                }
            } else {
                if (this.banksBranch.length > 0) {
                    const defaultBranch = this.banksBranch[0];
                    this.ppoFormDetails.patchValue({
                        bankBranch: defaultBranch.id,
                        ifscCode: defaultBranch.ifscCode,
                    });
                }
            }
            this.hasBranches = this.banksBranch.length > 0;
        } else {
            this.banksBranch = [];
            this.hasBranches = false;
        }
    }

    async fetchBranchesByBankId(bankId: number): Promise<void> {
        try {
            const response = await firstValueFrom(
                this.pensionBankBranchService.getBranchesByBankId(bankId)
            );
            if (
                response.apiResponseStatus === 'Success' &&
                response.result &&
                response.result.branches
            ) {
                this.banksBranch = response.result.branches.map(
                    (branch: any) => ({
                        id: branch.id,
                        label: `${branch.branchName} - ${branch.ifscCode}`, // Use branchName as the label
                        ifscCode: branch.ifscCode,
                    })
                );
                this.hasBranches = this.banksBranch.length > 0; // Update the hasBranches flag
            } else {
                this.banksBranch = []; // or some other default value
                this.hasBranches = false; // Update the hasBranches flag
            }
        } catch (error) {
            this.tostService.showError(
                'An error occurred while fetching branches'
            );
        }
    }

    getFirstDateOfCurrentMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // fetchAll cat dep
    async setCat() {
        if (this.ppoFormDetails.get('categoryId')?.value) {
            await firstValueFrom(
                this.ppoCategoryService
                    .getCategoryById(
                        this.ppoFormDetails.get('categoryId')?.value
                    )
                    .pipe(
                        tap((res) => {
                            if (res.result) {
                                this.handelCategoryDescription(res.result);
                            }
                        })
                    )
            );
        }
    }

    async getData(ppoID: number) {
        if (ppoID != null) {
            const response = await firstValueFrom(
                this.PensionPPODetailsService.getPensionerByPpoId(ppoID)
            );
            if (response.apiResponseStatus === APIResponseStatus.Success) {
                if (response.result != undefined && response.result?.category) {
                    this.ppoFormDetails.patchValue(response.result);
                    const bank = response.result.branch?.bank;
                    const branch = response.result.branch;
                    if (bank) {
                        this.banks = [
                            {
                                label: bank.bankName,
                                value: bank.id,
                            },
                        ];
                        this.onChangeBank({ value: bank.id });
                        this.onChangeBankBranch;

                        const branch = response.result.branch;
                        this.fetchBanks();
                        this.ppoFormDetails.get('bank')?.setValue(bank.id);
                    }
                    if (branch) {
                        this.ppoFormDetails.patchValue({
                            bankBranch: branch.id,
                            ifscCode: branch.ifscCode,
                        });
                    } else {
                        this.tostService.showError('Branch details not found.');
                    }
                    this.handelCategoryDescription(response.result.category);
                    this.ppoFormDetails.patchValue({
                        dateOfRetirement: this.parseDate(
                            response.result.dateOfRetirement
                        ),
                        dateOfCommencement: this.parseDate(
                            response.result.dateOfCommencement
                        ),
                        dateOfBirth: this.parseDate(
                            response.result.dateOfBirth
                        ),
                        ifscCode: response.result.branch?.ifscCode,
                    });
                }
            }
        }
    }

    getFormValues(): any {
        const form = this.ppoFormDetails;
        return {
            ppoNo: form.get('ppoNo')?.value,
            ppoType: form.get('ppoType')?.value,
            ppoSubType: form.get('ppoSubType')?.value,
            categoryId: form.get('categoryId')?.value,
            branchId: form.value.bankBranch, // Added here
            bankId: form.value.bank, // Added here
            accountHolderName: form.get('accountHolderName')?.value,
            payMode: form.get('payMode')?.value,
            bankAcNo: form.get('bankAcNo')?.value,
            pensionerName: form.get('pensionerName')?.value,
            gender: form.get('gender')?.value || null, // Handle optional field
            dateOfBirth: this.formatDate(form.get('dateOfBirth')?.value),
            mobileNumber: form.get('mobileNumber')?.value || null, // Optional
            emailId: form.get('emailId')?.value || null, // Optional
            pensionerAddress: form.get('pensionerAddress')?.value || null,
            identificationMark: form.get('identificationMark')?.value || null,
            panNo: form.get('panNo')?.value || null, // Optional
            aadhaarNo: form.get('aadhaarNo')?.value || null,
            dateOfRetirement: this.formatDate(
                form.get('dateOfRetirement')?.value
            ),
            dateOfCommencement: this.formatDate(
                form.get('dateOfCommencement')?.value
            ),
            commutedFromDate:
                this.formatDate(form.get('commutedFromDate')?.value) || null,
            commutedUptoDate: this.formatDate(
                form.get('commutedUptoDate')?.value
            ),
            basicPensionAmount: form.get('basicPensionAmount')?.value,
            commutedPensionAmount: form.get('commutedPensionAmount')?.value,
            enhancePensionAmount: form.get('enhancePensionAmount')?.value,
            reducedPensionAmount: form.get('reducedPensionAmount')?.value,
            religion: form.get('religion')?.value,
        };
    }

    async updateData() {
        const formValue = this.getFormValues();
        const id = this.ppoFormDetails.get('ppoId')?.value;
        try {
            const response = await firstValueFrom(
                this.PensionPPODetailsService.updatePensionerByPpoId(
                    id,
                    formValue
                )
            );
            if (response.apiResponseStatus === APIResponseStatus.Success) {
                this.tostService.showSuccess('' + response.message);
            } else {
                this.tostService.showError('' + response.message);
            }
        } catch (error) {
            this.tostService.showError('somting Want wrong');
        }
    }

    // Unified method to handle both save and update operations
    async handleSaveOrUpdate() {
        if (this.isEditMode) {
            await this.updateData();
        } else {
            await this.saveData();
        }
    }

    // Check if the URL contains 'edit' to set the edit mode
    checkIfEditModeFromUrl() {
        const currentUrl = this.router.url;
        if (currentUrl.includes('/edit')) {
            this.isEditMode = true; // Enable edit mode
        }
    }

    formatDate(dateString: string): string | null {
        const date = new Date(dateString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return null; // Return null for invalid dates
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Returns the formatted date
    }

    async ppoStatus(ppoId: number) {
        const ID = ppoId;
        const status: PensionStatusDTOJsonAPIResponse = await firstValueFrom(
            this.statusService.getPpoStatusFlagByPpoId(ID, 'PpoApproved')
        );
        // console.log(status);
        if (status.result?.statusFlag == 'PpoApproved') {
            this.pensionerStatus = status.result?.statusFlag;
            this.ApprovalFlag = 'true';
        } else {
            this.ApprovalFlag = 'false';
        }
        if (status.result?.statusWef) {
            this.PPOApproveDate = status.result?.statusWef;
        }
    }
}
