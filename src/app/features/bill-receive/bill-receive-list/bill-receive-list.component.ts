import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IBills } from 'src/app/core/models/bill';
import { BillService } from 'src/app/core/services/Bill/bill.service';
import { OnlineBillReceiveService } from 'src/app/core/services/Bill/online-bill-receive.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { TokenService } from 'src/app/core/services/Token/token.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DatePipe } from '@angular/common';
import { Message, MessageService } from 'primeng/api';
import { tokenPrint } from 'src/app/core/models/token';
// import  jsPDF  from 'jspdf';
// import "jspdf-autotable";

@Component({
    selector: 'app-bill-receive-list',
    templateUrl: './bill-receive-list.component.html',
    styleUrls: ['./bill-receive-list.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class BillReceiveListComponent implements OnInit {
    bills: IBills[][] | any;
    tokenPrintDetail:tokenPrint|any;
    loading: boolean = false;
    displayMaximizable: boolean | undefined;
    messages: Message[] = [];
    cols: any[] = [];
    exportColumns: any;
    products = [
        {
            treasury_name: 'Product 1',
            tokenNo: 20,
            tokenDate: '12/2/2022',
            billNo: 12,
            billDate: '12/2/2022',
            ddoCode: '22',
            payeeDept: 'AM',
            AccountCode: '2043-00-001-001-V-01',
            NetAmount: 250.00,
            BillGrossAmount: 250,
            RsinAmount: 'Two Hundred Fifty Only.'
        },];
  @ViewChild('myDialog') myDialog: any;
  constructor(private elementRef: ElementRef, public billService: BillService, private toastService: ToastService, private onlineBillReceiveService: OnlineBillReceiveService, private router: Router, private confirmationService: ConfirmationService, private tokenService: TokenService, private notificationService: NotificationService, private datePipe: DatePipe,public billservice: BillService) { }

  ngOnInit(): void {
      // this.products  = [
      //   { treasury_name: 'Product 1', tokenNo: 20, tokenDate: '12/2/2022', billNo:12,billDate:'12/2/2022',ddoCode:'22',payeeDept:'AM', AccountCode:'2043-00-001-001-V-01', NetAmount:250.00, BillGrossAmount: 250, RsinAmount:'Two Hundred Fifty Only.'},
      // ];
      this.allBillls();
      this.messages = [{ severity: 'success', summary: 'Success', detail: 'Token Generated Successfully' }];
      this.cols = [
          { field: "name", header: "Govt. of West Bengal - Treasury" },
          { field: "category", header: "Token Number" },
          { field: "quantity", header: "Token Date:" },
          { field: "quantity", header: "Bill Number::" },
          { field: "quantity", header: "Bill Date:" },
          { field: "quantity", header: "DDO Code:" },
          { field: "quantity", header: "Payee Dept:" },
          { field: "quantity", header: "Account Code:" },
          { field: "quantity", header: "Net Amount:" },
          { field: "quantity", header: "Bill Gross Amount:" },
          { field: "quantity", header: "Rs in Amount:" },
      ];
      this.exportColumns = this.cols.map(col => ({
          title: col.header,
          dataKey: col.field
      }));
  }
  allBillls(){
      this.billService.getAllBills().subscribe((response)=>{
          if(response.apiResponseStatus==1){
              this.bills = response.result;
              console.log('checking',this.bills);
          }else{
              this.toastService.showAlert(response.message,response.apiResponseStatus);
          }
      });
  }

  confirm(event: Event | any, billId: any) {
      this.confirmationService.confirm({      
          target: event.target,
          message: 'Are you sure that you want to proceed?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              console.log('hi');

              this.sendForBillReceive(billId);
              //this.test();
          },
          reject: () => {
              //reject action
          }
      });
  }

  sendForBillReceive(billId: number) {
      console.log('hi');
    
      const payloadData = {
          billId: billId,
          physicalBillDate: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
          remarks: '',
      }
      this.tokenService.generateToken(payloadData).subscribe((res) => {
          if (res.result) {
              this.onlineBillReceiveService.selectedBillId = 0;
              this.onlineBillReceiveService.selectedBillRefNo = 0;
              this.tokenPrint(res.result.tokenId);
              // this.notificationService.success(res.message, "Your Token No is: " + res.result);
              this.displayMaximizable = true;
              // this.router.navigate(['/bill-receive']);
              return;
          }
      
          this.notificationService.error(res.message);
      });
  }
  tokenPrint(tokenId:number){
      this.tokenService.getPrintDetails(tokenId).subscribe((response)=>{
          if(response.apiResponseStatus==1){
              this.tokenPrintDetail = response.result;
              this.displayMaximizable = true;
              return;
          }
          this.toastService.showError(response.message);
      });
  }
  test() {
      this.displayMaximizable = true;
  }

  // printDialogContent() {

  //   const doc = new jsPDF();
  //   const content = this.myDialog.nativeElement.innerHTML;
  //   console.log('c', content);

  //   doc.html(content, {
  //     callback: () => {
  //       const printWindow = window.open(doc.output('bloburl'), '_blank');
  //       printWindow?.addEventListener('load', () => {
  //         printWindow.print();
  //       })
  //     },
  //     windowWidth: 1000 
  //   });
  // }
  exportPdf() {
      // const doc = new jsPDF();
      // doc.autoTable();
      // doc['autoTable']({ columns: this.exportColumns, body: this.products });
      // doc['autoTable'](this.exportColumns, this.products);
      // doc['autoTable']();
      // doc.save("products.pdf");
  }

  print() {
      const printWindow = window.open('', '_blank');
      const tableToPrint = this.myDialog.nativeElement.cloneNode(true);
      const printCSS = `
    table {
      width: 100%;
      margin: 0 auto;
      border: 1px solid;
    }
    td{
      padding:5px;
    }
    td span{
      margin-left:15px;
    }
    `;
      const styleElement = printWindow!.document.createElement('style');
      styleElement.textContent = printCSS;
    printWindow!.document.head.appendChild(styleElement);
    printWindow!.document.body.appendChild(tableToPrint);
    printWindow!.print();
    window.location.reload();
  }

}
