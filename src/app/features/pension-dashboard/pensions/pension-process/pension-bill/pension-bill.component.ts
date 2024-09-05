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
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
@Component({
  selector: 'app-pension-bill',
  templateUrl: './pension-bill.component.html',
  styleUrls: ['./pension-bill.component.scss'],
  providers: [MessageService],
})

export class PensionBillComponent implements OnInit {
  ppoId?: number;
  payments: any[] = [];
  pensioncategory: any = {};
  period: string = '';
  pensionForm: FormGroup = this.fb.group({});
  totalDueAmount: number = 0;
  isDataLoaded: boolean = false;
  billdate = new Date().toISOString().split('T')[0];
  ppoList$: Observable<any>;
  result?: any;
  response: any;
  hasGenerated: boolean = true;
  hasSaved: boolean = false;
  res: any;
  massage: string = '';
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
        this.response = await firstValueFrom(this.service.generateFirstPensionBill(payload2));
        this.isApiResponseStatus1 = this.response.apiResponseStatus === 1;
        if (this.response.apiResponseStatus === 1) {
          this.hasSaved = true;
          this.result = this.response.result;
          if (!this.result.pensioner.bankAccounts || 
            this.result.pensioner.bankAccounts.length === 0 || 
            this.result.pensioner.bankAccounts[0].bankAcNo === null) {
            this.hasSaved = false;
            this.isApiResponseStatus1 = false;
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Not found pensioner bank account!",
            });
          }
          else {
            this.pensionForm.patchValue({
              ppoNo: this.result.pensioner.ppoNo,
              pensionerName: this.result.pensioner.pensionerName,
              periodFrom: this.result.pensioner.dateOfRetirement,
              accountNo: this.result.pensioner.bankAccounts[0].bankAcNo,
              bankName: this.result.pensioner.bankAccounts[0].bankCode,
            });
            this.payments = this.result.pensionerPayments;
            this.pensioncategory = this.result.pensioner.category;
            this.calculateTotalDueAmount();
            this.isDataLoaded = true;
            this.massage = '';
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Success",
              text: "First bill generate",
              showConfirmButton: false,
              timer: 1300,
              width: '500px',
              padding: '3em',
              customClass: {
                title: '.swal-custom-title ',
              }
            });
          }
        } if (this.response.apiResponseStatus === 3) {
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
        if(this.response.apiResponseStatus === 1){
        await  this.saveFirstBill();
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
      ppoId: this.result.pensioner.ppoId,
      toDate: this.result.billDate,
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
        });
        this.hasSaved = false;
      } if(this.res.apiResponseStatus === 3){
        Swal.fire({
          title: "Are you sure?",
          text: "The first pension bill is already saved!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        });
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

  // Print bill
  billprint(): void{
    this.router.navigate(['/pension/modules/pension-process/bill-print/first-pension']);
  }
}

