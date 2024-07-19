import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table/lib/mh-prime-dynamic-table-interface';
import { ActionButtonConfig } from 'src/app/core/models/dynamic-table';
import { ApprovedByClerk } from 'src/app/core/models/stamp';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-stamp-requisition-staging',
  templateUrl: './stamp-requisition-staging.component.html',
  styleUrls: ['./stamp-requisition-staging.component.scss']
})
export class StampRequisitionStagingComponent implements OnInit {

  listType: string = 'new'
  id: number = 0
  sheet: number = 0
  label: number = 0
  discountAmount: number = 0
  denomination: number = 0
  noOfLabelsPerSheet: number = 0
  taxAmount: number = 0.1 * this.discountAmount
  quantity: number = (this.noOfLabelsPerSheet * this.sheet) + this.label
  amount: number = this.quantity * this.denomination
  challanAmount: number = this.amount - this.discountAmount + this.taxAmount;
  noOfSheets: number = 0
  modal: boolean = false
  tableData!: DynamicTable<any>;
  tableActionButton: ActionButtonConfig[] = [];
  tableQueryParameters!: DynamicTableQueryParameters | any;
  approveByClerkPayload!: ApprovedByClerk
  approveByClerkForm!: FormGroup
  constructor(private stampRequisitionService: StampRequisitionService,
    private toastService: ToastService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.initialozeForm()
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };

    this.changeDynamicTable(this.listType);
  }

  initialozeForm() {
    this.approveByClerkForm = this.fb.group({
      sheet: [0, [Validators.required, Validators.min(0)]],
      label: [0, [Validators.required, Validators.min(0)]],
    });
  }

  changeDynamicTable(listType: string) {
    this.listType = listType;
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    if (this.listType === 'new') {
      this.tableActionButton = [
        {
          buttonIdentifier: 'reject',
          class: 'p-button-danger p-button-sm',
          icon: 'pi pi-times',
          lable: 'Reject',
        },
        {
          buttonIdentifier: 'edit',
          class: 'p-button-warning p-button-sm',
          icon: 'pi pi-file-edit',
          lable: 'Edit & Approve',
        },
      ];
      this.getAllNewRequisitions();
    } else if (this.listType === 'approvedByClerk') {
      this.tableActionButton = [];
      this.getAllApprovedByClerkRequisitions();
    }
  }

  handleButtonClick($event: any) {
    switch ($event.buttonIdentifier) {
      case 'reject':
        this.stampRequisitionService.rejectedByStampClerk($event.rowData.vendorStampRequisitionId).subscribe((response) => {
          if (response.apiResponseStatus == 1) {
            this.toastService.showSuccess(response.message)
            this.getAllNewRequisitions()
          } else {
            this.toastService.showError(response.message)
          }
        })
        break;
      case 'edit':
        this.modal = true
        this.id = $event.rowData.vendorStampRequisitionId
        this.sheet = $event.rowData.sheet
        this.label = $event.rowData.label
    }
  }

  approveByClerk() {
    if (this.approveByClerkForm.valid) {
      this.approveByClerkPayload = {
        labelByClerk: Number(this.approveByClerkForm.value.label),
        sheetByClerk: Number(this.approveByClerkForm.value.sheet),
        vendorStampRequisitionId: this.id
      }
      // console.log(this.approveByClerkPayload)
      this.stampRequisitionService.approveByClerk(this.approveByClerkPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showSuccess(response.message)
          this.getAllNewRequisitions()
          this.approveByClerkForm.reset()
          this.modal = false
        } else {
          this.toastService.showError(response.message)
        }
      })
    } else {
      this.toastService.showWarning("Please fill all the fields.")
    }
  }

  getAllNewRequisitions() {
    this.stampRequisitionService.newRequisitions(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.tableData = response.result;
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  getAllApprovedByClerkRequisitions() {
    this.stampRequisitionService.getAllRequisitionsForwardedToTOForApproval(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.tableData = response.result;
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  labelSelected($event: any) {

  }

  sheetSelected($event: any) {

  }
}
