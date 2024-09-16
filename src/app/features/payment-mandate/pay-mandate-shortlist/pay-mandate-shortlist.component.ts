import { Component, OnInit } from '@angular/core';
import { Paymandate } from 'src/app/core/models/paymandate';
import { PaymandateService } from 'src/app/core/services/paymandate/paymandate.service';
import { BillService } from 'src/app/core/services/Bill/bill.service';
import { ToastService } from 'src/app/core/services/toast.service';




@Component({
    selector: 'app-pay-mandate-shortlist',
    templateUrl: './pay-mandate-shortlist.component.html',
    styleUrls: ['./pay-mandate-shortlist.component.scss']
})
export class PayMandateShortlistComponent implements OnInit {
  [x: string]: any;
  stateOptions: any[] = [{ label: 'Current Financial Year', value: '1' }, { label: 'Previous Financial Year  ', value: '2' }];
  value: any = '1';
  isPaymentSelected: boolean = true;
  loading: boolean = false;
  paymandateShortlist: Paymandate[] = [];
  selectedPaymandates: any;
  constructor(private paymandateservice: PaymandateService, public billservice: BillService, private toastService: ToastService) { }

  ngOnInit(): void {
      this.allpaymandateShortlist();
  }

  allpaymandateShortlist() {
      this.paymandateservice.getPaymandateShortlist().subscribe((response) => {
          if (response.apiResponseStatus == 1) {
              this.paymandateShortlist = response.result;
              console.log('->>>', this.paymandateShortlist);

          } else {

          }
      })
  }

  selectPaymandate(paymandate: any) {
      // console.log(paymandate);

      // if (!this.selectedPaymandates) {
      //   this.selectedPaymandates = []; 
      // }
      // this.selectedPaymandates.push(paymandate);
  }

  updateSelectedPaymandates(paymandate: any) {
      // console.log(paymandate);

      // if (!this.selectedPaymandates) {
      //   this.selectedPaymandates = []; 
      // }
      // if (paymandate.selected) {
      //   this.selectedPaymandates.push(paymandate);
      // } else {
      //   const index = this.selectedPaymandates.findIndex(item => item?.tokenId === paymandate?.tokenId);
      //   if (index !== -1) {
      //     this.selectedPaymandates.splice(index, 1);
      //   }
      // }
  }


  dataSave() {
      if (this.selectedPaymandates && this.selectedPaymandates.length > 0) {
          const payloadArray = this.selectedPaymandates.map((paymandate: { tokenId: any; selectedDate: any; }) => ({
              tokenId: paymandate.tokenId,
              PaymentDate: new Date(paymandate.selectedDate).toISOString(),
          }));
          console.log('tt');
          console.log(payloadArray);
          this.paymandateservice.saveNewPaymandateShortlist(payloadArray).subscribe((response) => {
              console.log('ht');
              if (response.apiResponseStatus == 1) {
                  this.toastService.showAlert(
                      response.message,
                      response.apiResponseStatus
                  );
                  this.allpaymandateShortlist();
              } else {
                  this.toastService.showError(response.message);
              }
          })
          console.log('---->', payloadArray);
      } else {
          console.error('No paymandates selected.');
      }
  }

}
