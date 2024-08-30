import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PensionBankAccountsService, BankService } from 'src/app/api';
import { firstValueFrom, tap } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private service: PensionBankAccountsService,
    private banksService: BankService,
    private tostService: ToastService,
    private route: ActivatedRoute // Inject ActivatedRoute
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
    // Fetch banks and route parameters
    this.fetchBanks();
    
    // Check if ppoId is provided via route parameters
    this.route.paramMap.subscribe(params => {
      const routePpoId = params.get('ppoId');
      if (routePpoId) {
        this.ppoId = routePpoId;
        this.legend = "ID-" + this.ppoId;
        this.fetchUserInfo();
      }
    });
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
    if (!this.BankDetailsForm.valid) {
      this.tostService.showWarning("Fill all fields");
      return;
    }

    if (this.isEditing) {
      await firstValueFrom(this.service.updateBankAccountByPpoId(Number(this.ppoId), this.BankDetailsForm.value).pipe(
        tap(response => {
          if (response.apiResponseStatus === 1) {
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
        if (response.apiResponseStatus === 1) {
          this.tostService.showSuccess('Bank account saved successfully');
        } else {
          this.tostService.showWarning("Failed saving bank account");
        }
      })
    ));
  }
}
