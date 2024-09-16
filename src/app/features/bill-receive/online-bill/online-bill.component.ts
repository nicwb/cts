import { Component, OnInit } from '@angular/core';
import { OnlineBillReceiveService } from 'src/app/core/services/Bill/online-bill-receive.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-online-bill',
    templateUrl: './online-bill.component.html',
    styleUrls: ['./online-bill.component.scss']
})
export class OnlineBillComponent implements OnInit {
    selectedRefNo: number = 0;
    toastService: any;
    router: any;
    onlineBill: any;

    constructor( public onlineBillReceiveService: OnlineBillReceiveService) { }

    ngOnInit(): void {
        this.selectedRefNo = this.onlineBillReceiveService.selectedBillRefNo;
        if (this.selectedRefNo) {
            this.billDetails();
        } else {
            this.toastService.showError("Select a bill first.");
            this.router.navigate(["/bill-receive"]);
        }
    }

    billDetails(){
        this.onlineBillReceiveService.getBillDetailsByRef(this.selectedRefNo).subscribe((response) => {
            if (response.apiResponseStatus == 1) {
                this.onlineBill=response.result;
                return;
            }
        })

    }

}
