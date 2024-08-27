import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PensionBankAccountsService, BankService } from 'src/app/api';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';

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
  isEditing:boolean=false;
  legend:string = "Bank Details"
  constructor(
    private fb: FormBuilder,
    private service: PensionBankAccountsService,
    private banksService: BankService,
    private tostService: ToastService
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
      branchCode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchBanks();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['ppoId'] && this.ppoId) {
      this.legend = "ID-"+this.ppoId;
      await this.fetchUserInfo();
    }else{
      this.legend = "Bank Details";
    }
    if (changes['pensionerName'] && this.pensionerName) {
      this.BankDetailsForm.patchValue({ accountHolderName: this.pensionerName });
    }
  }

  async fetchBanks(){
    await firstValueFrom(
      this.banksService.getAllBanks().pipe(
        tap(response => {
          if (response.result) {
            this.banks = response.result;
            // console.log('All banks:', this.banks);
          } else {
            // console.error('No banks found');
            this.tostService.showWarning("No banks found");
          }
        })
      )
    );
  }
  
  async fetchUserInfo() {
    try {
      await firstValueFrom(
        this.service.getBankAccountByPpoId(Number(this.ppoId)).pipe(
          tap(async response => {
            if (response.result) {
              console.log(response.result)
              this.BankDetailsForm.patchValue(response.result);
              // console.log('Bank accounts:', this.banks);
              this.isEditing=true;
              return;
            }
          })
        )
      );

    } catch (error) {
      console.error('Error fetching bank data', error);
    }
  }

  async onChangeBank(event:any){
    console.log('Bank selected:', event);
    if (event.value && event.value.code) {
      this.BankDetailsForm.patchValue({bankCode: event.value.code})
      await firstValueFrom(this.banksService.getBranchesByBankCode(event.value.code).pipe(
        tap(response => {
            if (response.result) {
              this.banksBranch = response.result;
              // console.log('Bank branches:', this.banksBranch);
            } else {
              this.tostService.showWarning('No bank branches found');
            }
          }
        )
      ))
      
    }
    else{
      this.banksBranch = undefined
    }
  }
  async onChangeBankBranch(event: any){
    // console.log('Bank branch selected:', event);
    if (event.code) {
      this.BankDetailsForm.patchValue({branchCode: event.code})
      await firstValueFrom(this.banksService.getBranchByBranchCode(event.code).pipe(
        tap(
          response => {
            if (response.result) {
              // console.log('Bank branch details:', response.result);
              if (response.result.mircCode) {
                this.BankDetailsForm.patchValue({ ifscCode: response.result.mircCode });
              }
            } else {
              this.tostService.showWarning('No bank branch details found');
            }
          }
        )
      ))
    }
  }
  async saveData() {
    console.log('Saving data');
    console.log(this.BankDetailsForm.valid);
    if (!this.BankDetailsForm.valid) {
      this.tostService.showWarning("Fill all fields")
      console.log("Invalid ",this.BankDetailsForm.value)
      return;
    }

    if (this.isEditing) {
      await firstValueFrom(this.service.updateBankAccountByPpoId(Number(this.ppoId), this.BankDetailsForm.value).pipe(
        tap(
          response => {
            if (response.apiResponseStatus === 1) {
              this.tostService.showSuccess('Bank account update successfully');
            } else {
              console.error('Error saving bank account', response.message);
              this.tostService.showWarning("Failed saving bank account")
            }
          }
        )
      ))
      return;
    }
    await firstValueFrom(this.service.createBankAccount(Number(this.ppoId), this.BankDetailsForm.value).pipe(
      tap(
        response => {
          if (response.apiResponseStatus === 1) {
            this.tostService.showSuccess('Bank account saved successfully');
          } else {
            console.error('Error saving bank account', response.message);
            this.tostService.showWarning("Failed saving bank account")
          }
        }
      )
    ))
  }
}
