import { Component, OnInit } from '@angular/core';
import { StampRequisitionStatusEnum } from 'src/app/core/enum/stampRequisitionEnum';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { GetVendorStampRequisition } from 'src/app/core/models/stamp';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { ToastService } from 'src/app/core/services/toast.service';

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
      buttonIdentifier: 'details',
      class: 'p-button-success p-button-sm',
      icon: 'pi pi-print',
      lable: 'Details',
      renderButton: (rowData) => {        
        return (rowData.status === StampRequisitionStatusEnum.WaitingForPayment || rowData.status === StampRequisitionStatusEnum.WaitingForDelivery || rowData.status === StampRequisitionStatusEnum.DeliveredToVendor || rowData.status === StampRequisitionStatusEnum.ForwardedToTreasuryOfficer )
      }
    },
      {
        buttonIdentifier: 'print',
        class: 'p-button-info p-button-sm',
        icon: 'pi pi-print',
        lable: 'Print',
        renderButton: (rowData) => {
          return rowData.status == StampRequisitionStatusEnum.WaitingForPayment
        }
      },
    ]
  }

  getAllStampRequisitions($event: any) {
    this.isLoading = true
    this.stampRequisitionService
      .getAllStampRequisitions(this.tableQueryParameters, $event)
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
        if ($event.rowData.status === StampRequisitionStatusEnum.ForwardedToTreasuryOfficer) {
          this.getRequisitionDetailsByIdAfterClerkModification($event.rowData.id)
        } else if ($event.rowData.status === StampRequisitionStatusEnum.WaitingForPayment || $event.rowData.status === StampRequisitionStatusEnum.WaitingForDelivery || $event.rowData.status === StampRequisitionStatusEnum.DeliveredToVendor ) {
          this.getRequisitionDetailsByIdAfterTOModification($event.rowData.id)
        }
        break;
    }
  }
  getRequisitionDetailsByIdAfterClerkModification(id: number) {
    this.detailsTableLoading = true
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.stampRequisitionService.getStampRequisitionDetailsByIdAfterClerkModification(id, this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus === 1) {
        this.detailTableData = response.result
      } else {
        this.toastService.showError(response.message);
      }
    })
    this.detailsTableLoading = false
  }

  getRequisitionDetailsByIdAfterTOModification(id: number) {
    this.detailsTableLoading = true
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.stampRequisitionService.getStampRequisitionDetailsByIdAfterTOModification(id, this.tableQueryParameters).subscribe((response) => {
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

  search($event: any) {
    this.getAllStampRequisitions($event)
  }
}
