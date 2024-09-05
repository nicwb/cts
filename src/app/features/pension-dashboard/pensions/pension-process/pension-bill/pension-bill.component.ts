import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
  PensionFirstBillService,
  InitiateFirstPensionBillDTO,
  PpoBillEntryDTO,
  PpoBillBreakupEntryDTO,
  PpoComponentRevisionEntryDTO,
  PensionPPODetailsService,
  PensionComponentRevisionService,
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
@Component({
  selector: 'app-pension-bill',
  templateUrl: './pension-bill.component.html',
  styleUrls: ['./pension-bill.component.scss'],
  providers: [MessageService],
//   styles: [
//     `
//       :host ::ng-deep .p-menubar-root-list {
//         flex-wrap: wrap;
//       }
//       :host ::ng-deep .p-calendar .p-inputtext {
//   padding: 1.2rem;
//   padding-left: 0.50rem; /* Adjust left padding as needed */
// }
//     `,
//   ],
})

export class PensionBillComponent implements OnInit {
  ppoId?: number;
  payments: any[] = [];
  pensioncategory: any = {};
  period: string = '';
  pensionForm: FormGroup = this.fb.group({});
  isCurrentStepValid = false;
  totalDueAmount: number = 0;
  isDataLoaded: boolean = false;
  billdate = new Date().toISOString().split('T')[0];
  ppoList$: Observable<any>;
  result?: any;
  response: any;
  revisionResults: any;
  hasGenerated: boolean = true;
  hasSaved: boolean = false;
  res: any;
  massage: string = '';
  saved: boolean = true;
  today: Date = new Date();
  check: any;
  validppid: boolean = true;
  endOfMonth: Date = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0); // Initialized directly
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
    this.endOfMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
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
        const response = await firstValueFrom(this.service.generateFirstPensionBill(payload2));
        this.isApiResponseStatus1 = response.apiResponseStatus === 1;
        if (response.apiResponseStatus === 1) {
          this.hasSaved = true;
          this.result = response.result;
          if (this.result.bankAccount === null) {
            this.hasSaved = false;
            this.isApiResponseStatus1 = false;

            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Not found pensioner bank account!",
            });
          }
          else {
            console.log(this.result);
            this.pensionForm.patchValue({
              ppoNo: this.result.pensioner.ppoNo,
              pensionerName: this.result.pensioner.pensionerName,
              periodFrom: this.result.pensioner.dateOfRetirement,
              accountNo: this.result.bankAccount.bankAcNo,
              bankName: this.result.bankAccount.bankCode,
            });
            this.payments = this.result.pensionerPayments;
            this.pensioncategory = this.result.pensionCategory;
            this.calculateTotalDueAmount();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Success",
              text: "First bill generate",
              showConfirmButton: false,
              timer: 2500,
              width: '500px',
              padding: '3em',
              customClass: {
                title: '.swal-custom-title ',
              }
            }).then(() => {
            this.isDataLoaded = true;
            this.massage = '';
          });
          }
        } if (response.apiResponseStatus === 3) {
          this.hasSaved = false;
          this.isApiResponseStatus1 = false;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Not Generate First Pension Bill!",
          });

        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something Went wrong!",
        });
        this.hasSaved = false;
        this.isApiResponseStatus1 = false;
      }
    }
  }

  // save function 
  async save() {
    try {
      if (this.result) {
        const ppoId = this.result.pensioner.ppoId;
        const payloadArray: PpoComponentRevisionEntryDTO = this.result.pensionCategory.componentRates.map((rate: any) => ({
          rateId: rate.breakupId,
          fromDate: rate.effectiveFromDate,
          amountPerMonth: rate.rateAmount,
        }));
        this.response = await firstValueFrom(this.revisionService.createSinglePpoComponentRevision(ppoId, payloadArray));
        if (this.response.apiResponseStatus === 1) {
          let getfirstpensionbill = await firstValueFrom(this.service.getFirstPensionBillByPpoId(ppoId));
          if (getfirstpensionbill.apiResponseStatus === 3) {
            this.saved = true;
            await this.saveFirstBill();
          } else if (getfirstpensionbill.apiResponseStatus === 1) {
            this.revisionResults = await firstValueFrom(this.revisionService.getPpoComponentRevisionsByPpoId(ppoId));
            if (this.revisionResults.apiResponseStatus === 1) {
              this.saved = false;
              await this.saveFirstBill();

            }
          }
        }
        else if (this.response.apiResponseStatus === 3) {
          this.revisionResults = await firstValueFrom(this.revisionService.getPpoComponentRevisionsByPpoId(ppoId));
          if (this.revisionResults.apiResponseStatus === 1) {
            let check = await firstValueFrom(this.service.getFirstPensionBillByPpoId(ppoId));
            if (Array.isArray(this.revisionResults.result) && this.revisionResults.result.length > 1) {
              if (this.revisionResults.result.length === check.result?.ppoBillBreakups?.length) {
                const swalWithTailwindButtons = Swal.mixin({
                  customClass: {
                    confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md mx-2 border-transparent',
                    cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md mx-2 border-transparent',
                  },
                  buttonsStyling: false,
                });
                swalWithTailwindButtons.fire({
                  title: 'Are you sure?',
                  text: "The first bill is already saved!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, save it!',
                  cancelButtonText: 'No, cancel!',
                  reverseButtons: true,
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    await this.saveFirstBill();
                  } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire({
                      title: 'Cancelled',
                      text: 'The save operation was cancelled.',
                      icon: 'error',
                    });
                  }
                });
              } else {
                await this.saveFirstBill();
              }
            }
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred.';
      this.toastService.showError(errorMessage);
    }
  }

  // save first bill
  
  async saveFirstBill() {
    const saveFirstBill: PpoBillEntryDTO = {
      // pensionerId: this.result.pensioner.id,
      // bankAccountId: this.result.bankAccount.id,
      ppoId: this.result.pensioner.ppoId,
      // fromDate: this.result.pensioner.dateOfRetirement,
      toDate: this.result.billDate,
      // billType: 'F',
      // billDate: this.billdate,
      // grossAmount: this.result.grossAmount,
      // byTransferAmount: this.result.netAmount,
      // netAmount: this.result.netAmount,
      // breakups: this.result.pensionerPayments.map((payment: PpoBillBreakupEntryDTO, index: number) => {
      //   let revisionId: number | undefined;

      //   if (this.response.apiResponseStatus === 1 && this.saved) {
      //     this.revisionResults = this.response.result || [];
      //     revisionId = this.revisionResults[index]?.id;
      //   } else {  // if (this.response.apiResponseStatus === 3 || this.saved)
      //     revisionId = this.revisionResults.result[index]?.id;
      //   }
      //   return {
      //     revisionId: revisionId,
      //     ppoId: this.result.pensioner.ppoId,
      //     fromDate: payment.fromDate,
      //     toDate: payment.toDate,
      //     breakupAmount: payment.netAmount,
      //     dueAmount: payment.dueAmount,
      //     drawnAmount: payment.drawnAmount
      //   };
      // }),

    };
    try {
      this.res = await firstValueFrom(this.service.saveFirstPensionBill(saveFirstBill));
      if (this.res?.apiResponseStatus === 1) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success",
          text: "First bill saved",
          showConfirmButton: false,
          timer: 2500,
          width: '500px',
          padding: '3em',
          customClass: {
            title: '.swal-custom-title ',
          }
        }).then(() => {
          // Using Angular Router to navigate
          this.router.navigate(['/pension/modules/pension-process/bill-print/first-pension']);
        });
        this.hasSaved = false;
      }
    } catch (billError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        width: '500px',
        text: "Failed to save the first pension bill!",
      });
    }
  }

  // check ppoid is valid or not
  massageColor: string = '';
  async onInputBlur() {
    if (this.ppoId) {
      this.check = await firstValueFrom(this.ppoListService.getPensionerByPpoId(this.ppoId));
      if (this.check.apiResponseStatus === 3) {
        this.massage = "Invalid ppoId!";
        this.massageColor = 'text-red-600';
        this.validppid = false;
      } else if (this.check.apiResponseStatus === 1) {
        this.massage = '';
        this.validppid = true;
      }
    }
    else {
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
    this.totalDueAmount = this.payments.reduce((acc, payment) => acc + payment.dueAmount, 0);
  }

  // generate button cuntrol
  get isgenerate(): boolean {
    return !!this.ppoId && !!this.period && this.validppid && this.hasGenerated && !this.isApiResponseStatus1;
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
}

