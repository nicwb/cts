import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StampWalletRefill } from 'src/app/core/models/stamp';
import { StampWalletService } from 'src/app/core/services/stamp/stamp-wallet.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-stamp-wallet-refill',
    templateUrl: './stamp-wallet-refill.component.html',
    styleUrls: ['./stamp-wallet-refill.component.scss']
})
export class StampWalletRefillComponent implements OnInit {
    stampQuantity: number = 0;
    stampWalletRefillForm!: FormGroup;
    treasuryCode!: string;
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
            quantity: ['', Validators.required],
        });
    }

    onTreasurySelected($event: any) {
        this.treasuryCode = $event;
        this.getStampWalletBalance()

    }

    createOrUpdateWallet() {
        if (this.stampWalletRefillForm.valid) {
            this.walletRefillPayload = {
                clearBalance: this.stampWalletRefillForm.value.quantity,
                treasuryCode: this.treasuryCode
            };
            console.log(this.walletRefillPayload);

            this.stampWalletService.createOrUpdateStampWallet(this.walletRefillPayload).subscribe((response) => {
                if (response.apiResponseStatus == 1) {
                    this.toastService.showAlert(response.message, 1);
                    // this.stampWalletRefillForm.reset()
                    this.getStampWalletBalance()
                } else {
                    this.toastService.showAlert(response.message, response.apiResponseStatus);
                }
            });
        } else {
            this.toastService.showAlert('Please fill all the required fields', 0);
        }
    }

    getStampWalletBalance() {
        this.stampWalletService.getStampWalletBalanceByTreasuryCode(this.treasuryCode).subscribe((response) => {
            if (response.apiResponseStatus == 1) {
                console.log(response);
                this.stampQuantity = response.result
            } else {
                this.toastService.showAlert(response.message, response.apiResponseStatus);
            }
        })
        return 0
    }
}
