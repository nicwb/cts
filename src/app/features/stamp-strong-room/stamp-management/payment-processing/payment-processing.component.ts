import { Component, OnInit } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { GetVendorStampRequisition } from 'src/app/core/models/stamp';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-payment-processing',
  templateUrl: './payment-processing.component.html',
  styleUrls: ['./payment-processing.component.scss']
})
export class PaymentProcessingComponent implements OnInit {

  registerGRNModal: boolean = false
  printModal: boolean = false
  printData: any
  vendorStampRequisitionId: number = 0
  GRNNo: number = 0
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetVendorStampRequisition>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  constructor(private stampRequisitionService: StampRequisitionService,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.tableActionButton = [
      {
        buttonIdentifier: 'print',
        class: 'p-button-info p-button-sm',
        icon: 'pi pi-print',
        lable: 'Print',
      },
      {
        buttonIdentifier: 'grn',
        class: 'p-button-warning p-button-sm',
        icon: 'pi pi-file-edit',
        lable: 'Register GRN',
      },
    ];
    this.getAllRequisitionsWaitingForPayment()
  }

  handleButtonClick($event: any) {
    switch ($event.buttonIdentifier) {
      case 'print':
        this.getDataForPrint($event.rowData.id, $event.rowData.requisitionNo)
        break;
      case 'grn':
        this.registerGRNModal = true
        this.vendorStampRequisitionId = $event.rowData.id
        break;
    }
  }

  getAllRequisitionsWaitingForPayment() {
    this.stampRequisitionService.getAllRequisitionsWaitingForPayment(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.tableData = response.result
      } else {
        this.toastService.showError(response.message)
      }
    })
  }


  registerGRNNo() {
    if (this.GRNNo && this.vendorStampRequisitionId) {
      console.log({ vendorStampRequisitionId: this.vendorStampRequisitionId, GRNNo: Number(this.GRNNo) });
      this.stampRequisitionService.registerGRNNo({ vendorStampRequisitionId: this.vendorStampRequisitionId, GRNNo: this.GRNNo }).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showSuccess(response.message)
          this.registerGRNModal = false
          this.getAllRequisitionsWaitingForPayment()
        } else {
          this.toastService.showError(response.message)
        }
      })
    } else {
      this.toastService.showWarning("Requisition Id or GRNNo is missing")
    }
  }

  GRNNoSelected($event: any) {
    this.GRNNo = $event
  }
  getDataForPrint(id: number, reqNo: string) {
    this.stampRequisitionService.printtr7(id).subscribe((response) => {
      console.log(id);
      if (response.apiResponseStatus == 1) {
        this.printData = {
          reqNo: reqNo,
          raisedToTreasury: response.result.raisedToTreasury,
          hoa: response.result.hoa,
          detailHead: response.result.detailHead,
          amount: response.result.amount,
          vendorName: response.result.vendorName,
          vendorAddress: response.result.vendorAddress,
          treasuryName: response.result.treasuryName
        }
        this.printModal = true
      } else {
        this.toastService.showError(response.message)
      }
    })
  }
}
