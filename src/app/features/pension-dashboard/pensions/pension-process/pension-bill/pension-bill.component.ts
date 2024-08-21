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

@Component({
  selector: 'app-pension-bill',
  templateUrl: './pension-bill.component.html',
  providers: [MessageService],
  styles: [
    `
      :host ::ng-deep .p-menubar-root-list {
        flex-wrap: wrap;
      }
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

  get isButtonEnabled(): boolean {
    // console.log('Checking button enabled state:', !!this.ppoId, !!this.period, !this.hasGenerated);
    return !!this.ppoId && !!this.period && !this.hasGenerated;
  }

  get isSaveEnable(): boolean {
    // console.log('Checking save button enabled state:', this.hasGenerated, this.pensionForm.valid, !this.hasSaved);
    return this.hasGenerated && this.pensionForm.valid && !this.hasSaved;
  }

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
    console.log('Form Valid:', this.pensionForm.valid);

    console.log('Form validity on init:', this.pensionForm.valid);

    this.pensionForm.valueChanges.subscribe(() => {
      this.updateStepValidity();
      console.log('Form validity after changes:', this.pensionForm.valid);
    });

    this.updateStepValidity();
  }

  updateStepValidity() {
    this.isCurrentStepValid = this.getCurrentStepControls().valid;
    console.log('Current step validity:', this.isCurrentStepValid);
  }

  getCurrentStepControls() {
    return this.pensionForm;
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
        console.log(response);
        if (response && response.result) {
          this.result = response.result;
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
          this.isDataLoaded = true;
        }
      } catch (err) {
        console.error('Error fetching record:', err);
      }
    }
  }

  refresh() {
    if (this.pensionForm.value) {
      this.pensionForm.reset();
      this.pensionForm.patchValue({
        billDate: this.today,
      });

      this.isDataLoaded = false;
      this.hasGenerated = false;
      this.hasSaved = false; // Reset the saved state on refresh
    }
  }

  async save() {
    if(this.hasSaved){
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
        console.log(`Number of elements sent: ${payloadArray.length}`);

        this.response = await firstValueFrom(this.revisionService.createPpoComponentRevisions(ppoId, payloadArray));

        if (this.response.apiResponseStatus === 1) {
          await this.saveFirstBill();
        } else if (this.response.apiResponseStatus === 3) {
          this.toastService.showWarning("Component Detail already exists.");
          this.revisionResults = await firstValueFrom(this.revisionService.getPpoComponentRevisionsByPpoId(ppoId));
          if (this.revisionResults.apiResponseStatus === 1) {
            if (Array.isArray(this.revisionResults.result) && this.revisionResults.result.length > 1) {
              this.toastService.showWarning('Bill already exists.');
            } else {
              await this.saveFirstBill();
            }
          }
        }

        this.hasSaved = true; // Disable the save button after saving
      }
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred.';
      this.toastService.showError(errorMessage);
    }
  }

  calculateTotalDueAmount() {
    this.totalDueAmount = this.payments.reduce((acc, payment) => acc + payment.dueAmount, 0);
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
        } else if (this.response.apiResponseStatus === 3) {
          revisionId = this.revisionResults.result[index]?.id;
        }

        return {
          revisionId: revisionId,
          ppoId: this.result.pensioner.ppoId,
          fromDate: payment.fromDate,
          toDate: payment.toDate,
          breakupAmount: payment.dueAmount,
        };
      }),
    };
    try {
      const res = await firstValueFrom(this.service.saveFirstPensionBill(saveFirstBill));
      this.toastService.showSuccess("Bill saved successfully.");
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
}
