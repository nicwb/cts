import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChequeInvoiceSeries, chequeReceivedDamagedDetails, invoiceDetailsList } from 'src/app/core/models/cheque';
import { ChequeInvoiceService } from 'src/app/core/services/cheque/cheque-invoice.service';
import { ChequeReceiveService } from 'src/app/core/services/cheque/cheque-receive.service';
import { ToastService } from 'src/app/core/services/toast.service';

interface chequeDamageType {
  name: string;
  code: Number;
}

@Component({
    selector: 'app-cheque-received',
    templateUrl: './cheque-received.component.html',
    styleUrls: ['./cheque-received.component.scss']
})
export class ChequeReceivedComponent implements OnInit {

    receivedForm!: FormGroup;
    isVisible?: boolean;
    invoiceId?: number;
    invoiceDetailsList!: invoiceDetailsList;
    chequesDamageType!: chequeDamageType[];
    chequesDamageType1: chequeReceivedDamagedDetails[]=[];
    constructor(private fb: FormBuilder, private route: ActivatedRoute, private chequeinvoiceservice: ChequeInvoiceService, private toastService: ToastService, private chequeReceiveService: ChequeReceiveService , private router: Router) { }

    ngOnInit(): void {
        this.chequesDamageType = [
            { name: 'Torn', code: 1 },
            { name: 'Printing Missing', code: 2 },
        ];
        this.invoiceId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
        this.getInvoiceDetails(this.invoiceId);
        // this.receivedForm = this.fb.group({
        //   chequeDamage: this.fb.array([])
        // })
        // this.initForm();

    }
    initDamagedChequeEntry(item:ChequeInvoiceSeries,index:number) {
        this.chequesDamageType1[index] = {invoiceDeatilsId:item.invoiceDeatilsId,damageType:0,damageIndex:''};
        console.log(this.chequesDamageType1);
        item.isVisible = true;
    
    }
    getInvoiceDetails(id: number) {
        this.chequeinvoiceservice.getInvoiceDetails(id).subscribe((res) => {
            if (res.apiResponseStatus == 1) {
                this.invoiceDetailsList = res.result;
                console.log('ff', this.invoiceDetailsList);
            } else {
                this.toastService.showError(res.message);
            }
        });
    }
    // get chequeDamage(): FormArray {
    //   return this.receivedForm.get('chequeDamage') as FormArray;
    // }

    // initForm(): void {
    //   this.invoiceDetailsList.chequeInvoiceSeries.forEach(item => {
    //     this.chequeDamage.push(this.fb.group({
    //       damage_type: new FormControl(''),
    //       series_range: new FormControl('')
    //     }));
    //   });
    // }


    addDamagedChequeEntry(item: any, i: number) {
        item.isVisible = true;
  
    }
    cancelDamagedChequeEntry(item: any, index:number) {
        if (this.chequesDamageType1[index]) {
            this.chequesDamageType1.splice(index, 1);
        }
        item.isVisible = false;
    // item.isVisible = false;
    // (this.receivedForm.get('chequeDamage') as FormArray).removeAt(index);
    }

    rcvFormsubmit() {
        const payload = {
            invoiceId: this.invoiceId || 0,
            series: this.invoiceDetailsList.chequeInvoiceSeries[0].series,
            treasuryCode: this.invoiceDetailsList.chequeInvoiceSeries[0].treasuryCode,
            micrCode: this.invoiceDetailsList.chequeInvoiceSeries[0].micrCode,
            chequeReceivedDamagedDetails: this.chequesDamageType1
        };
        console.log('----->', payload);
        // this.chequeReceiveService.saveChequeReceive(payload).subscribe(res => {
        //   if (res.apiResponseStatus == 1) {
        //     this.toastService.showAlert(
        //       res.message,
        //       res.apiResponseStatus,
        //     );
        //     this.router.navigate(['cheque/cheque-indent-invoice']);
        //   } else {
        //     this.toastService.showError(res.message);
        //   }

        // })
    }
}

