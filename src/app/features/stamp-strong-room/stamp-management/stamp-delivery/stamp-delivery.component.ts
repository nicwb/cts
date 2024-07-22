import { Component, OnInit } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { GetVendorStampRequisition } from 'src/app/core/models/stamp';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-stamp-delivery',
  templateUrl: './stamp-delivery.component.html',
  styleUrls: ['./stamp-delivery.component.scss']
})
export class StampDeliveryComponent implements OnInit {

  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetVendorStampRequisition>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  constructor(private stampRequisitionService: StampRequisitionService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.tableActionButton = [
      {
        buttonIdentifier: 'delivey',
        class: 'p-button-success p-button-sm',
        icon: 'pi pi-truck',
        lable: 'Deliver',
      },]
    this.getAllStampRequisitionsForDelivery()
  }

  getAllStampRequisitionsForDelivery() {
    this.stampRequisitionService
      .getAllStampRequisitionWaitingForDelivery(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.tableData = response.result
        } else {
          this.toastService.showError(response.message)
        }
      })
  }

  requisitionDeliveredToVendor(id: number) {
    this.stampRequisitionService.stampRequisitionDeliveredToVendor(id).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.toastService.showSuccess(response.message)
        this.getAllStampRequisitionsForDelivery()
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  handleButtonClick($event: any) {
    this.requisitionDeliveredToVendor($event.rowData.vendorStampRequisitionId)
  }
}
