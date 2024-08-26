import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
  PensionFirstBillService,
  InitiateFirstPensionBillDTO,
  PpoBillEntryDTO,
  PpoBillBreakupEntryDTO,
  PpoComponentRevisionEntryDTO,
  PensionPPODetailsService,
  PensionerListItemDTOIEnumerableDynamicListResultJsonAPIResponse,
  PensionComponentRevisionService,
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { flush } from '@angular/core/testing';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-pension-bill',
  templateUrl: './pension-bill.component.html',
  providers: [MessageService],
  styles: [
    `
      :host ::ng-deep .p-menubar-root-list {
        flex-wrap: wrap;
      }
      :host ::ng-deep .p-calendar .p-inputtext {
  padding: 1.2rem;
  padding-left: 0.50rem; /* Adjust left padding as needed */
}
      // .p-calendar .p-inputtext {
      //   padding: 0.9rem; /* Equivalent to p-2 in Tailwind CSS */
      // }

      // :host ::ng-deep app-popup-table span{
      // padding: 0.78rem;
      // }
    `,
  ],

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
  today = new Date().toISOString().split('T')[0];
  ppoList$: Observable<PensionerListItemDTOIEnumerableDynamicListResultJsonAPIResponse>;
  result: any;
  response: any;
  revisionResults: any;
  hasGenerated: boolean = false;
  hasSaved: boolean = false;
  hasinput: boolean = true;
  isDisabled: boolean = false;
  res: any;
  massage:string = '';

  
  constructor(
    private fb: FormBuilder,
    private service: PensionFirstBillService,
    private ppoListService: PensionPPODetailsService,
    private revisionService: PensionComponentRevisionService,
    private toastService: ToastService
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
  
  onDateSelect(event: Date) {
    this.period = this.formatDate(event);
  }

  ngOnInit(): void {
    this.pensionForm = this.fb.group({
      ppoId: ['', Validators.required],
      ppoNo: ['', Validators.required],
      pensionerName: ['', Validators.required],
      periodFrom: ['', Validators.required],
      periodTo: ['', Validators.required],
      bankName: ['', Validators.required],
      accountNo: ['', Validators.required],
      billDate: [this.today, Validators.required],
      // paymentMode: [null, Validators.required],
    });
  }
 
  public async getvalue() {
    if (this.hasGenerated) {
      return;
    }
    const payload2: InitiateFirstPensionBillDTO = {
      ppoId: this.ppoId as number,
      toDate: this.period,
    };
    if (this.ppoId && this.period) {
      try {
        const response = await firstValueFrom(this.service.generateFirstPensionBill(payload2));
        this.hasGenerated = true;
        this.isDisabled = true;
        if (response && response.result) {
          this.result = response.result;
          if (this.result.bankAccount === null) {
            this.toastService.showError('Not found pensioner bank account');
            this.hasGenerated = false;
            this.isDisabled = false;
          }
          else {
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
            this.isDataLoaded = true;
            this.hasinput = false;
          }
        }
      } catch (err) {
        console.error('Error fetching record:', err);
      }
    }
  }


  async save() {
    if (this.hasSaved) {
      return;
    }

    try {
      if (this.result) {
        this.hasSaved = false;
        const ppoId = this.result.pensioner.ppoId;
        const payloadArray: PpoComponentRevisionEntryDTO[] = this.result.pensionCategory.componentRates.map((rate: any) => ({
          rateId: rate.breakupId,
          fromDate: rate.effectiveFromDate,
          amountPerMonth: rate.rateAmount,
        }));
        // console.log(`Number of elements sent: ${payloadArray.length}`);

        this.response = await firstValueFrom(this.revisionService.createPpoComponentRevisions(ppoId, payloadArray));

        if (this.response.apiResponseStatus === 1) {
          this.revisionResults = await firstValueFrom(this.service.getFirstPensionBillByPpoId(ppoId));
        
          if (this.revisionResults.apiResponseStatus === 3) {
            await this.saveFirstBill();
          } else if (this.revisionResults.apiResponseStatus === 1) {
            // console.log("hello");
        
            for (const breakup of this.revisionResults.result.ppoBillBreakups) {
              const { id: revisionId, fromDate, toDate } = breakup;
              console.log(revisionId, fromDate, toDate);
            }
            
            // for(const componentrevision of this.response.result){
            //   const {id: id, fromDate} = componentrevision;
            //   console.log(id,fromDate);

            // 
          }
        }
         else if (this.response.apiResponseStatus === 3) {
          this.revisionResults = await firstValueFrom(this.revisionService.getPpoComponentRevisionsByPpoId(ppoId));
          let check = await firstValueFrom(this.service.getFirstPensionBillByPpoId(ppoId));
          if (this.revisionResults.apiResponseStatus === 1) {
            if (Array.isArray(this.revisionResults.result) && this.revisionResults.result.length > 1) {
              // this.toastService.showWarning("Component Detail already exists.");
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
                  text: "You won't be able to revert this!",
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
                    this.hasSaved = false; // Reset the saved state on refresh
                  }
                });
              } else {
                await this.saveFirstBill();
              }


            }
          }
        }
        if(this.res && this.res.apiResponseStatus === 1){
        this.hasSaved = true; // Disable the save button after saving
        }
      }
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred.';
      this.toastService.showError(errorMessage);
    }
  }


  async saveFirstBill() {
    const saveFirstBill: PpoBillEntryDTO = {
      pensionerId: this.result.pensioner.id,
      bankAccountId: this.result.bankAccount.id,
      ppoId: this.result.pensioner.ppoId,
      fromDate: this.result.pensioner.dateOfRetirement,
      toDate: this.result.billDate,
      billType: 'F',
      billDate: this.today,
      grossAmount: this.result.grossAmount,
      byTransferAmount: this.result.netAmount,
      netAmount: this.result.netAmount,
      breakups: this.result.pensionerPayments.map((payment: PpoBillBreakupEntryDTO, index: number) => {
        let revisionId: number | undefined;

        if (this.response.apiResponseStatus === 1) {
          this.revisionResults = this.response?.result || [];
          revisionId = this.revisionResults[index]?.id;
        }else if (this.response.apiResponseStatus === 3) {
          revisionId = this.revisionResults.result[index]?.id;
        }

        return {
          revisionId: revisionId,
          ppoId: this.result.pensioner.ppoId,
          fromDate: payment.fromDate,
          toDate: payment.toDate,
          breakupAmount: this.result.pensionerPayments.netAmount,
        };
      }),
    };
    try {
      this.res = await firstValueFrom(this.service.saveFirstPensionBill(saveFirstBill));
      if(this.res.apiResponseStatus === 1){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success",
          text: "First bill saved",
          showConfirmButton: false,
          timer: 2500,
          width: '500px', // Increased width
          padding: '3em', // Increased padding
          customClass: {
            title: '.swal-custom-title ', // Reference to the custom class for the title
            // Reference to the custom class for the content (if needed)
          }
        });
      }
    } catch (billError) {
      const errorMessage = (billError instanceof Error) ? billError.message : 'Failed to save the first pension bill.';
      this.toastService.showError(errorMessage);
    }
  }

  handleSelectedRow(event: any) {
    this.pensionForm.patchValue({
      ppoId: event.ppoId,
    });
  }

  onInputClick() {
    if (this.isDisabled) {
      alert("Insert a new entry Please click refresh !");
    }
  }

  calculateTotalDueAmount() {
    this.totalDueAmount = this.payments.reduce((acc, payment) => acc + payment.dueAmount, 0);
  }

  get isButtonEnabled(): boolean {
    // console.log('Checking button enabled state:', !!this.ppoId, !!this.period, !this.hasGenerated);
    return !!this.ppoId && !!this.period && !this.hasGenerated;
  }

  get isSaveEnable(): boolean {
    // console.log('Checking save button enabled state:', this.hasGenerated, this.pensionForm.valid, !this.hasSaved);
    return this.hasGenerated && this.pensionForm.valid && !this.hasSaved;
  }


   // refresh
   refresh() {
    if (this.pensionForm.value) {
      this.pensionForm.reset();
      this.pensionForm.patchValue({
        billDate: this.today,
      });

      this.isDataLoaded = false;
      this.hasGenerated = false;
      this.hasSaved = false; // Reset the saved state on refresh
      this.isDisabled = false;
    }
  }

   
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  async onInputBlur(){
    if(this.ppoId){
      const id = this.ppoId;
      const check = await firstValueFrom(this.service.getFirstPensionBillByPpoId(id));

      console.log(check.result?.ppoBillBreakups?.length);
      if(check.apiResponseStatus === 3){
        this.massage = "PPO id not exist!";
      }else if(check.apiResponseStatus === 1){
        this.massage = "Valid PPO id"
      }
    }
    else {
      this.massage = '';
    }
  }
}
