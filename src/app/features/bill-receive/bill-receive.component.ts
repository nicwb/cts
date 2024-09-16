import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBills } from 'src/app/core/models/bill';
import { BillService } from 'src/app/core/services/Bill/bill.service';
import { OnlineBillReceiveService } from 'src/app/core/services/Bill/online-bill-receive.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-bill-receive',
    templateUrl: './bill-receive.component.html',
    styleUrls: ['./bill-receive.component.scss']
})
export class BillReceiveComponent implements OnInit {
    bills:IBills[][] | any;
    loading:boolean = false;
    constructor(private billService:BillService,private toastService:ToastService) { }

    ngOnInit(): void {
        this.allBillls
    }
    allBillls(){
        this.billService.getAllBills().subscribe((response)=>{
            if(response.apiResponseStatus==1){
                this.bills = response.result;
            }else{
                this.toastService.showAlert(response.message,response.apiResponseStatus);
            }
        });
    }
}
