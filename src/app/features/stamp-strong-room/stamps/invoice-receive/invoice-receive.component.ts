import { Component, OnInit } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'src/app/core/models/dynamic-table';
import { AddStampInvoice, GetStampIndents } from 'src/app/core/models/stamp';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { StampIndentInvoiceService } from 'src/app/core/services/stamp/stamp-indent-invoice.service';

@Component({
  selector: 'app-invoice-receive',
  templateUrl: './invoice-receive.component.html',
  styleUrls: ['./invoice-receive.component.scss']
})
export class InvoiceReceiveComponent implements OnInit {

  tableActionButton: ActionButtonConfig<GetStampIndents>[] = [];
  tableQueryParameters!: DynamicTableQueryParameters | any;
  tableData!: DynamicTable<GetStampIndents>;
  stampIndentReceivePayload!: AddStampInvoice
  constructor(
    private stampIndentInvoiceService: StampIndentInvoiceService,
    private toastService: ToastService,) { }

  ngOnInit(): void {
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };

    this.tableActionButton = [
      {
        buttonIdentifier: 'receive',
        class: 'p-button-info p-button-sm',
        icon: 'pi pi-inbox',
        lable: 'Receive',
      },
    ];
    this.getAllStampIndents()
  }

  getAllStampIndents() {
    this.stampIndentInvoiceService
      .getAllStampIndentsProcessed(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          response.result.data.map((item: any) => {
            item.createdAt = convertDate(item.createdAt);
            item.memoDate = convertDate(item.memoDate);
          });
          this.tableData = response.result;
        } else {
          this.toastService.showAlert(
            response.message,
            response.apiResponseStatus
          );
        }
      });
  }
  handleButtonClick($event: any) {
    let indents = $event.rowData.childData
    indents = indents.map((element: any, index: number) => {
      return {
        stampCombinationId:element.combinationId,
        sheet:element.sheet,
        label:element.label,
        quantity:element.quantity,
        amount:element.amount
      }
    })
    this.stampIndentReceivePayload = {
      indentId: $event.rowData.id,
      stampIndentData: indents
    }
    console.log(this.stampIndentReceivePayload);
    this.stampIndentInvoiceService.receiveIndent(this.stampIndentReceivePayload).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.toastService.showSuccess(
          response.message,
        );
        this.getAllStampIndents()
      } else {
        this.toastService.showAlert(
          response.message,
          response.apiResponseStatus
        );
      }
    })
  }
}
