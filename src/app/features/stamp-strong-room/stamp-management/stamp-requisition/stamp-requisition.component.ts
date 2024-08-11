import { Component, OnInit } from '@angular/core';
import { StampRequisitionStatusEnum } from 'src/app/core/enum/stampRequisitionEnum';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { GetVendorStampRequisition } from 'src/app/core/models/stamp';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';

@Component({
  selector: 'app-stamp-requisition',
  templateUrl: './stamp-requisition.component.html',
  styleUrls: ['./stamp-requisition.component.scss']
})
export class StampRequisitionComponent implements OnInit {

  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetVendorStampRequisition>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  printModal: boolean = false
  printData: any
  detailTableData!: DynamicTable<GetVendorStampRequisition>
  displayDetailsModal: boolean = false
  isLoading: boolean = false
  detailsTableLoading: boolean = false
  constructor(
    private stampRequisitionService: StampRequisitionService,
    private toastService: ToastService,) { }

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
        renderButton: (rowData) => {
          return rowData.status == StampRequisitionStatusEnum.WaitingForPayment
        }
      },
      {
        buttonIdentifier: 'details',
        class: 'p-button-info p-button-sm',
        icon: 'pi pi-print',
        lable: 'Details',
        renderButton: (rowData) => {
          return rowData.status == StampRequisitionStatusEnum.DeliveredToVendor
        }
      },
    ]
    this.getAllStampRequisitions()
  }

  getAllStampRequisitions() {
    this.isLoading = true
    this.stampRequisitionService
      .getAllStampRequisitions(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.tableData = response.result;
        } else {
          this.toastService.showError(
            response.message
          );
        }
      });
      this.isLoading = false
  }

  handleButtonClick($event: any) {
    switch ($event.buttonIdentifier) {
      case 'print':
        this.getDataForPrint($event.rowData.id, $event.rowData.requisitionNo)
        break;
      case 'details':
        this.displayDetailsModal = true
        this.getRequisitionDetailsById($event.rowData.id)
        break;
    }
  }
  getRequisitionDetailsById(id: number) {
    this.detailsTableLoading = true
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.stampRequisitionService.getStampRequisitionDetailsById(id, this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus === 1) {
        this.detailTableData = response.result
      } else {
        this.toastService.showError(response.message);
      }
    })
    this.detailsTableLoading = false
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
