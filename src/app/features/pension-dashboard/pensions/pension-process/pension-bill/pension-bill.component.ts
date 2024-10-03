import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
    PensionFirstBillService,
    InitiateFirstPensionBillDTO,
    PpoBillEntryDTO,
    PensionPPODetailsService,
    PensionComponentRevisionService,
    APIResponseStatus,
    InitiateFirstPensionBillResponseDTOJsonAPIResponse,
    PpoPaymentListItemDTO,
    ObjectJsonAPIResponse,
    BankService
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-pension-bill',
    templateUrl: './pension-bill.component.html',
    styleUrls: ['./pension-bill.component.scss'],
    providers: [MessageService],
})
export class PensionBillComponent implements OnInit {
    ppoId?: number;
    payments: PpoPaymentListItemDTO[] = [];
    pensioncategory: any = {};
    period: string = '';
    pensionForm: FormGroup = this.fb.group({});
    totalDueAmount: number = 0;
    isDataLoaded: boolean = false;
    billdate = new Date().toISOString().split('T')[0];
    ppoList$: Observable<any>;
    response!: InitiateFirstPensionBillResponseDTOJsonAPIResponse;
    hasGenerated: boolean = true;
    hasSaved: boolean = false;
    res?: ObjectJsonAPIResponse;
    massage: string = '';
    today: Date = new Date();
    check: any;
    validppid: boolean = true;
    endOfMonth: Date = new Date(
        this.today.getFullYear(),
        this.today.getMonth() + 1,
        0
    ); // Initialized directly
    isApiResponseStatus1: boolean = false;
    ppoInput: boolean = false;
    isSearch = false;
    bankName: string = '';
    returnUri: string | null = null;

    // Define all constractor
    constructor(
        private fb: FormBuilder,
        private service: PensionFirstBillService,
        private ppoListService: PensionPPODetailsService,
        private revisionService: PensionComponentRevisionService,
        private toastService: ToastService,
        private bankService: BankService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.ppoList$ = this.service.getAllPposForFirstBill();
    }

    //select data
    onDateSelect(event: Date) {
        this.period = this.formatDate(event);
    }
    // all from control
    ngOnInit(): void {
        this.endOfMonth = new Date(
            this.today.getFullYear(),
            this.today.getMonth() + 1,
            0
        );

        this.pensionForm = this.fb.group({
            ppoId: ['', Validators.required],
            ppoNo: ['', Validators.required],
            pensionerName: ['', Validators.required],
            periodFrom: ['', Validators.required],
            periodTo: [null, [Validators.required]],
            bankName: ['', Validators.required],
            accountNo: ['', Validators.required],
            billDate: [this.billdate, Validators.required],
        });

        // Check if we have stored values in sessionStorage
        const storedPpoId = sessionStorage.getItem('storedPpoId');
        const storedPeriodTo = sessionStorage.getItem('storedPeriodTo');

        if (storedPpoId && storedPeriodTo) {
            this.ppoId = Number(storedPpoId);
            this.period = storedPeriodTo;
            this.pensionForm.patchValue({
                ppoId: this.ppoId,
                periodTo: this.period
            });
            this.getvalue();


            sessionStorage.removeItem('storedPpoId');
            sessionStorage.removeItem('storedPeriodTo');
        }

        const storedResponse = sessionStorage.getItem('response');
        if (storedResponse) {
            this.response = JSON.parse(storedResponse);
            sessionStorage.removeItem('response');
        }

        const storedState = sessionStorage.getItem('pensionBillState');

        if (storedState) {
            const state = JSON.parse(storedState);
            this.ppoId = state.ppoId;
            this.period = state.period;
            this.pensionForm.patchValue(state.formValue);
            this.isDataLoaded = state.isDataLoaded;
            this.payments = state.payments;
            this.pensioncategory = state.pensioncategory;
            this.totalDueAmount = state.totalDueAmount;
            this.isApiResponseStatus1 = state.isApiResponseStatus1;
            this.ppoInput = state.ppoInput;
            this.isSearch = state.isSearch;
            this.hasSaved = state.hasSaved;

            // Clear stored values after using them
            sessionStorage.removeItem('pensionBillState');
        }
        this.returnUri = this.route.snapshot.queryParamMap.get('returnUri');
    }

    // all get value
    public async getvalue() {
        const payload2: InitiateFirstPensionBillDTO = {
            ppoId: this.ppoId as number,
            toDate: this.period,
        };
        if (this.ppoId && this.period) {
            try {
                this.response = await firstValueFrom(
                    this.service.generateFirstPensionBill(payload2)
                );

                if (this.response.apiResponseStatus === APIResponseStatus.Error &&
                    this.response.message === "Pensioner bank account not found!") {

                    const result = await Swal.fire({
                        title: 'Aww! Snap...',
                        text: 'Pensioner bank account not found!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Go to Bank Account Page',
                        cancelButtonText: 'Stay Here'
                    });

                    if (result.isConfirmed) {
                        // Store current values before navigation
                        sessionStorage.setItem('storedPpoId', this.ppoId.toString());
                        sessionStorage.setItem('storedPeriodTo', this.period);

                        // Navigate to bank account page
                        this.router.navigate(
                            ['/pension/modules/pension-process/ppo/entry', this.ppoId, 'bank-account'],
                            {
                                queryParams: {
                                    returnUri: '/pension/modules/pension-process/pension-bill'
                                }
                            }
                        );
                        return;
                    }
                }
                this.isApiResponseStatus1 =
                    this.response.apiResponseStatus ===
                    APIResponseStatus.Success;
                if (
                    this.response.apiResponseStatus ===
                    APIResponseStatus.Success
                ) {
                    this.isSearch = true;
                    this.ppoInput = true;
                    this.pensionForm.patchValue({
                        ppoNo: this.response.result?.pensioner?.ppoNo,
                        pensionerName: this.response.result?.pensioner?.pensionerName,
                        periodFrom: this.response.result?.pensioner?.dateOfRetirement,
                        accountNo: this.response?.result?.pensioner?.bankAcNo,
                        bankName: this.bankName, // Use the retrieved bank name
                        periodTo: this.response.result?.toDate,
                        billDate: this.response.result?.billDate,
                    });
                    this.payments = this.response?.result?.pensionerPayments || [];
                    this.pensioncategory = this.response?.result?.pensioner?.category;
                    this.calculateTotalDueAmount();
                    this.isDataLoaded = true;
                    this.hasSaved = true;
                    this.massage = '';
                    this.toastService.showSuccess(this.response.message ?? 'Success');
                }
                else if (
                    this.response.apiResponseStatus === APIResponseStatus.Error
                ) {
                    this.hasSaved = false;
                    this.isApiResponseStatus1 = false;
                    this.ppoInput = false;
                    this.toastService.showError(this.response.message ?? 'Something Went wrong!');
                }
            } catch (err) {
                this.toastService.showError(this.response.message ?? 'Something Went wrong!');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: this.response.message ?? 'Something Went wrong!',
                });
                this.hasSaved = false;
                this.isApiResponseStatus1 = false;
                this.ppoInput = false;
            }
        }
    }

    private async getBankName(branchCode: number): Promise<void> {
        try {
            const bankResponse = await firstValueFrom(this.bankService.getBranchByBranchCode(branchCode));
            if (bankResponse && bankResponse.result) {
                this.bankName = bankResponse.result?.bankName || 'Unknown Bank';
            } else {
                this.bankName = 'Unknown Bank';
            }
        } catch (error) {
            console.error('Error fetching bank details:', error);
            this.bankName = 'Error fetching bank name';
        }
    }

    // save function
    async save() {
        try {
            if (this.response.result) {
                if (
                    this.response.apiResponseStatus ===
                    APIResponseStatus.Success
                ) {
                    await this.saveFirstBill();
                    if (this.returnUri) {
                        const result = await Swal.fire({
                            title: 'First Pension Bill saved. Do you want to go back to the previous form?',
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'No'
                        });

                        if (result.isConfirmed) {
                            this.router.navigate([this.returnUri]);
                            return;
                        }
                    }
                }
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.';
            this.toastService.showError(this.response.message ?? 'Something Went wrong!');
        }
    }

    async saveFirstBill() {
        const saveFirstBill: PpoBillEntryDTO = {
            ppoId: this.response?.result?.pensioner?.ppoId ?? 0,
            month: 0,
            year: 0,
            toDate: this.response?.result?.billDate || '',
        };
        try {
            this.res = await firstValueFrom(
                this.service.saveFirstPensionBill(saveFirstBill)
            );
            if (this.res?.apiResponseStatus === APIResponseStatus.Success) {
                this.toastService.showSuccess(this.response.message ?? 'First bill saved');
                this.hasSaved = false;
            }
            if (this.res.apiResponseStatus === APIResponseStatus.Error) {
                if (this.res.message && this.res.message.toLowerCase().includes('not approved')) {
                    const result = await Swal.fire({
                        title: 'Approval Required',
                        text: this.res.message ?? 'This pension bill requires approval.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Go to Approval Page',
                        cancelButtonText: 'Stay Here'
                    });

                    if (result.isConfirmed) {
                        this.storeCurrentState();
                        // Store response object before navigating away
                        sessionStorage.setItem('response', JSON.stringify(this.response));

                        this.router.navigate(
                            ['/pension/modules/pension-process/approval/ppo-approval/', this.response?.result?.pensioner?.ppoId],
                            {
                                queryParams: {
                                    returnUri: '/pension/modules/pension-process/pension-bill'
                                }
                            }
                        );
                        return;
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: this.res.message ?? 'Failed to save the first pension bill!',
                        icon: 'error',
                    });
                }
            }
        } catch (billError) {
            this.toastService.showError(this.response.message ?? 'Failed to save the first pension bill!');
        }
    }



    // check ppoid is valid or not
    massageColor: string = '';
    async onInputBlur() {
        if (this.ppoId) {
            this.check = await firstValueFrom(
                this.ppoListService.getPensionerByPpoId(this.ppoId)
            );
            if (this.check.apiResponseStatus === APIResponseStatus.Error) {
                this.massage = this.response.message ?? 'Invalid ppoId!';
                this.massageColor = 'text-red-600';
                this.validppid = false;
            } else if (
                this.check.apiResponseStatus === APIResponseStatus.Success
            ) {
                this.massage = '';
                this.validppid = true;
            }
        } else {
            this.massage = '';
            this.massageColor = '';
        }
    }

    // select data insert into search-list
    handleSelectedRow(event: any) {
        this.pensionForm.patchValue({
            ppoId: event.ppoId,
        });
    }

    // calculate total value
    calculateTotalDueAmount() {
        this.totalDueAmount = this.payments?.reduce(
            (acc, payment) => acc + (payment?.dueAmount || 0), // Ensure payment and dueAmount are valid
            0
        ) || 0; // Fallback to 0 if payments is undefined
    }


    // generate button cuntrol
    get isgenerate(): boolean {
        return (
            !!this.ppoId &&
            !!this.period &&
            this.validppid &&
            this.hasGenerated &&
            !this.isApiResponseStatus1
        );
    }

    // refresh to clear all value
    refresh() {
        if (this.pensionForm.value) {
            this.pensionForm.reset();
            this.pensionForm.patchValue({
                billDate: this.billdate,
            });

            this.isDataLoaded = false;
            this.isApiResponseStatus1 = false;
            this.ppoInput = true;
            this.isSearch = false;
            this.hasSaved = false;
            this.massage = '';
            this.massageColor = '';
        }
    }

    // date calculate in p-calendar html propaty
    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    // Print bill
    billprint(): void {
        this.router.navigate(
            this.ppoId
                ? [
                    '/pension/modules/pension-process/bill-print',
                    this.ppoId,
                    'first-pension',
                ]
                : ['/pension/modules/pension-process/bill-print/first-pension']
        );
    }

    private storeCurrentState() {
        const currentState = {
            ppoId: this.ppoId,
            period: this.period,
            formValue: this.pensionForm.value,
            isDataLoaded: this.isDataLoaded,
            payments: this.payments,
            pensioncategory: this.pensioncategory,
            totalDueAmount: this.totalDueAmount,
            isApiResponseStatus1: this.isApiResponseStatus1,
            ppoInput: this.ppoInput,
            isSearch: this.isSearch,
            hasSaved: this.hasSaved
        };
        sessionStorage.setItem('pensionBillState', JSON.stringify(currentState));
    }
}
