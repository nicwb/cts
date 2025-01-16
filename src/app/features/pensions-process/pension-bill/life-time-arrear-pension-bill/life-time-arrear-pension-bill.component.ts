import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
    PensionerListItemDTOTableResponseDTOJsonAPIResponse,
    PensionPPODetailsService,
} from 'src/app/api';

@Component({
    selector: 'app-life-time-arrear-pension-bill',
    templateUrl: './life-time-arrear-pension-bill.component.html',
    styleUrls: ['./life-time-arrear-pension-bill.component.scss'],
})
export class LifeTimeArrearPensionBillComponent implements OnInit {
    allManualPPOReceipt$?: Observable<PensionerListItemDTOTableResponseDTOJsonAPIResponse>;
    lifeTimeArrearPensionBillForm: FormGroup = new FormGroup({});
    constructor(
        private ServiceForId: PensionPPODetailsService,
        private fb: FormBuilder
    ) {}
    ngOnInit(): void {
        this.allManualPPOReceipt$ = this.ServiceForId.getPensioners();
        this.ininalizer();
    }
    ininalizer() {
        this.lifeTimeArrearPensionBillForm = this.fb.group({
            ppoId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            ppoSlNo: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            ppoNo: ['', [Validators.required, Validators.maxLength(100)]],
            ppoName: ['', Validators.maxLength(100)],
            periodFrom: ['', Validators.required],
            periodTo: ['', Validators.required],
            bankName: ['', Validators.required],
            bankAcNo: ['', Validators.required],
        });
    }
    onRefresh(): void {
        this.lifeTimeArrearPensionBillForm.reset();
    }
    onGenerate() {
        console.log('Generation Button is clicked');
    }
    async handelManualEntrySelect(event: any) {
        console.log(event);
    }
    async saveData() {
        console.log('Save Button is clicked');
    }
}
