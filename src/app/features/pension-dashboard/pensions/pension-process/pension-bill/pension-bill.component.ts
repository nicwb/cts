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
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
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
    res: any;
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

    // Define all constractor
    constructor(
        private fb: FormBuilder,
        private service: PensionFirstBillService,
        private ppoListService: PensionPPODetailsService,
        private revisionService: PensionComponentRevisionService,
        private toastService: ToastService,
        private router: Router
    ) {
        const payload = {
            listType: 'type1',
            pageSize: 200,
            pageIndex: 0,
            filterParameters: [],
            sortParameters: {
                field: 'ppoNo',
                order: 'asc',
            },
        };
        this.ppoList$ = this.ppoListService.getAllPensioners(payload);
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
                this.isApiResponseStatus1 =
                    this.response.apiResponseStatus ===
                    APIResponseStatus.Success;
                if (
                    this.response.apiResponseStatus ===
                    APIResponseStatus.Success
                ) {
                    this.pensionForm.patchValue({
                        ppoNo: this.response.result?.pensioner?.ppoNo,
                        pensionerName:
                            this.response.result?.pensioner?.pensionerName,
                        periodFrom:
                            this.response.result?.pensioner?.dateOfRetirement,
                        accountNo:
                            this.response?.result?.pensioner?.bankAccounts?.[0]
                                ?.bankAcNo,

                        bankName:
                            this.response.result?.pensioner?.bankAccounts?.[0]
                                ?.bankCode,
                    });
                    this.payments =
                        this.response?.result?.pensionerPayments || [];
                    this.pensioncategory =
                        this.response?.result?.pensioner?.category;
                    this.calculateTotalDueAmount();
                    this.isDataLoaded = true;
                    this.hasSaved = true;
                    this.massage = '';
                    this.toastService.showSuccess('First bill generate'); 
                } 
                else if (
                    this.response.apiResponseStatus === APIResponseStatus.Error
                ) {
                    this.hasSaved = false;
                    this.isApiResponseStatus1 = false;
                    this.toastService.showError('First Pension Bill not found');
                }
            } catch (err) {
                this.toastService.showError('Something Went wrong!');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something Went wrong!',
                });
                this.hasSaved = false;
                this.isApiResponseStatus1 = false;
            }
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
                }
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.';
            this.toastService.showError(errorMessage);
        }
    }

    // save first bill

    async saveFirstBill() {
        const saveFirstBill: PpoBillEntryDTO = {
            ppoId: this.response?.result?.pensioner?.ppoId ?? 0, // Default to 0 if undefined or null
            toDate: this.response?.result?.billDate || '', // Assuming toDate is a string or valid date type
        };
        try {
            this.res = await firstValueFrom(
                this.service.saveFirstPensionBill(saveFirstBill)
            );
            if (this.res?.apiResponseStatus === APIResponseStatus.Success) {
                this.toastService.showSuccess('First bill saved');
                this.hasSaved = false;
            }
            if (this.res.apiResponseStatus === APIResponseStatus.Error) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'The first pension bill is already saved!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your file has been deleted.',
                            icon: 'success',
                        });
                    }
                });
            }
        } catch (billError) {
            this.toastService.showError('Failed to save the first pension bill!');
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
                this.massage = 'Invalid ppoId!';
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
}
