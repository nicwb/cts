import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StampWalletRefill } from 'src/app/core/models/stamp';
import { StampWalletService } from 'src/app/core/services/stamp/stamp-wallet.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { greaterThanZeroValidator } from 'src/utils/greaterThanZeroValidator';

@Component({
  selector: 'app-stamp-wallet-refill',
  templateUrl: './stamp-wallet-refill.component.html',
  styleUrls: ['./stamp-wallet-refill.component.scss']
})
export class StampWalletRefillComponent implements OnInit {
  sheet: number = 0;
  label: number = 0;
  stampWalletRefillForm!: FormGroup;
  treasuryCode!: string;
  combinationId: number = 0
  walletRefillPayload!: StampWalletRefill;
  constructor(
    private stampWalletService: StampWalletService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.initializeForm()
  }

  initializeForm(): void {
    this.stampWalletRefillForm = this.fb.group({
      addSheet: [0, [Validators.required, greaterThanZeroValidator()]],
      addLabel: [0, [Validators.required, greaterThanZeroValidator()]],
    });
  }

  

  onTreasurySelected($event: any) {
    this.treasuryCode = $event;
    if (this.combinationId && this.treasuryCode) {
      this.getStampWalletBalance()
    }
  }

  createOrUpdateWallet() {
    if (this.stampWalletRefillForm.valid && this.treasuryCode && this.combinationId) {
      this.walletRefillPayload = {
        treasuryCode: this.treasuryCode,
        addSheet: this.stampWalletRefillForm.value.addSheet,
        addLabel: this.stampWalletRefillForm.value.addLabel,
        combinationId: this.combinationId
      };
      
      this.stampWalletService.createOrUpdateStampWallet(this.walletRefillPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showAlert(response.message, 1);
          this.getStampWalletBalance()
        } else {
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
  }

  getStampWalletBalance() {
    this.stampWalletService.getStampWalletBalanceByTreasuryCodeAndCombinationId({ treasuryCode: this.treasuryCode, combinationId: this.combinationId }).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        console.log(response);
        
        this.sheet = response.result.sheetLedgerBalance
        this.label = response.result.labelLedgerBalance
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    })
    return 0
  }

  onStampCombinationSelected($event: any) {
    this.combinationId = $event.stampCombinationId
    if (this.combinationId && this.treasuryCode) {
      this.getStampWalletBalance()
    }

  }

  checkBalance() {
    if (this.treasuryCode && this.combinationId) {
      this.getStampWalletBalance()
    } else {
      this.toastService.showWarning('Treasury Code or Combination is missing.');

    }
  }
}
