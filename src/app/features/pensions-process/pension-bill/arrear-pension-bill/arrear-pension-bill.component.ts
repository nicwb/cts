import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { PensionPPODetailsService } from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-arrear-pension-bill',
    templateUrl: './arrear-pension-bill.component.html',
    styleUrls: ['./arrear-pension-bill.component.scss'],
})
export class ArrearPensionBillComponent implements OnInit {
    allManualPPOReceipt$?: Observable<any>;
    arrearPensionBillForm: FormGroup = new FormGroup({});

    constructor(
        private ServiceForId: PensionPPODetailsService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.allManualPPOReceipt$ = this.ServiceForId.getPensioners();
        this.ininalizer();
    }
    ininalizer() {
        this.arrearPensionBillForm = this.fb.group({
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
        this.arrearPensionBillForm.reset();
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
