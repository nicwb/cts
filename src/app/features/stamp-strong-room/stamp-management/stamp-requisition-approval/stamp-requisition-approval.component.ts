import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StampRequisitionStatusEnum } from 'src/app/core/enum/stampRequisitionEnum';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'src/app/core/models/dynamic-table';
import { ApprovedByTO } from 'src/app/core/models/stamp';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { StampWalletService } from 'src/app/core/services/stamp/stamp-wallet.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-stamp-requisition-approval',
  templateUrl: './stamp-requisition-approval.component.html',
  styleUrls: ['./stamp-requisition-approval.component.scss']
})
export class StampRequisitionApprovalComponent implements OnInit {

  denom: number = 0
  category: string = ""
  id: number = 0
  sheet: number = 0
  label: number = 0
  discountAmount: number = 0
  denomination: number = 0
  combinationId: number = 0
  treasuryCode: string = ""
  taxAmount: number = 0
  quantity: number = 0
  amount: number = 0
  challanAmount: number = 0
  noOfSheets: number = 0
  noOfLabels: number = 0
  modal: boolean = false
  listType: string = 'forwarded'
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<any>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  approveByTOForm!: FormGroup
  approveByTOPayload!: ApprovedByTO

  constructor(private stampRequisitionService: StampRequisitionService, private toastService: ToastService, private fb: FormBuilder, private stampWalletService: StampWalletService) { }

  ngOnInit(): void {
    this.initialozeForm()
    this.changeDynamicTable('forwarded')
  }

  changeDynamicTable(listType: string) {
    this.listType = listType;
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    if (this.listType === 'forwarded') {
      this.tableActionButton = [
        {
          buttonIdentifier: 'reject',
          class: 'p-button-danger p-button-sm',
          icon: 'pi pi-times',
          lable: 'Reject',
          renderButton: (rowData) => {
            return rowData.status == StampRequisitionStatusEnum.ForwardedToTreasuryOfficer
          }
        },
        {
          buttonIdentifier: 'edit',
          class: 'p-button-warning p-button-sm',
          icon: 'pi pi-file-edit',
          lable: 'Edit & Approve',
          renderButton: (rowData) => {
            return rowData.status == StampRequisitionStatusEnum.ForwardedToTreasuryOfficer
          }
        },
      ];
      this.getAllApprovedByClerkRequisitionsOrForwardedToTO()
    } else if (this.listType === 'waitingPaymentVerification') {

      this.tableActionButton = [
        {
          buttonIdentifier: 'approve',
          class: 'p-button-success p-button-sm',
          icon: 'pi pi-check-circle',
          lable: 'Approve',
          renderButton: (rowData) => {
            return rowData.status == StampRequisitionStatusEnum.WaitingForPaymentVerification
          }
        },
      ];
      this.getAllStampRequisitionWaitingForPaymentVerificatonByTO()
    }
  }

  initialozeForm() {
    this.approveByTOForm = this.fb.group({
      sheet: [0, [Validators.required, Validators.min(0)]],
      label: [0, [Validators.required, Validators.min(0)]],
    });
  }
  handleButtonClick($event: any) {
    switch ($event.buttonIdentifier) {
      case 'reject':
        this.stampRequisitionService.rejectedByTO($event.rowData.vendorStampRequisitionId).subscribe((response) => {
          if (response.apiResponseStatus == 1) {
            this.toastService.showSuccess(response.message)
            this.getAllApprovedByClerkRequisitionsOrForwardedToTO()
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
        this.combinationId = $event.rowData.combinationId
        this.treasuryCode = $event.rowData.raisedToTreasury
        this.getBalance({treasuryCode: this.treasuryCode, combinationId: this.combinationId})
        this.getAmountCalculations({vendorStampRequisitionId: this.id, sheet: this.sheet, label: this.label})
        break;
    }
  }

  getAllApprovedByClerkRequisitionsOrForwardedToTO() {
    this.stampRequisitionService.getAllRequisitionsForwardedToTOForApproval(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.tableData = response.result;
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  getAllStampRequisitionWaitingForPaymentVerificatonByTO() {
    this.stampRequisitionService.getAllStampRequisitionWaitingForPaymentVerificatonByTO(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.tableData = response.result
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  getAmountCalculations(params:any) {
    this.stampRequisitionService.getCalcAmountDetails({
      vendorStampRequisitionId: params.vendorStampRequisitionId,
      sheet: params.sheet,
      label: params.label
    }).subscribe((response) => {
      console.log(response);
      
      if (response.apiResponseStatus == 1) {
        this.challanAmount = response.result.challanAmount
        this.taxAmount = response.result.taxAmount
        this.discountAmount = response.result.discountAmount
        this.amount = response.result.amount
        this.quantity = response.result.quantity
      } else {
        this.toastService.showError(response.message)
      }
    }) 
  }

  approveByTO() {
    if (this.approveByTOForm.valid) {
      this.approveByTOPayload = {
        vendorStampRequisitionId: this.id,
        labelByTo: this.approveByTOForm.value.label,
        sheetByTo: this.approveByTOForm.value.sheet,
        challanAmount: this.challanAmount,
        discountedAmount: this.discountAmount,
        taxAmount: this.taxAmount
      }
      this.stampRequisitionService.approveByTO(this.approveByTOPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showSuccess(response.message)
          this.getAllApprovedByClerkRequisitionsOrForwardedToTO()
          this.approveByTOForm.reset()
          this.modal = false
        } else {
          this.toastService.showError(response.message)
        }
      })
    } else {
      this.toastService.showWarning("Please fill all the fields.")
    }
  }

  

  labelSelected($event: any) {
    console.log($event);
    
    this.label = $event
    if (this.label) {
      this.getAmountCalculations({vendorStampRequisitionId: this.id, sheet: this.sheet, label: this.label})
    }
  }
  
  sheetSelected($event: any) {
    this.sheet = $event
    if (this.sheet) {
      this.getAmountCalculations({vendorStampRequisitionId: this.id, sheet: this.sheet, label: this.label})
    }
  }

  getBalance(params: any) {
    this.stampWalletService.getStampWalletBalanceByTreasuryCodeAndCombinationId({treasuryCode: params.treasuryCode, combinationId: params.combinationId}).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.denom = response.result.denomination
        this.noOfSheets = response.result.sheetLedgerBalance
        this.noOfLabels = response.result.labelLedgerBalance
        this.category = response.result.category
      } else {
        this.toastService.showError(response.message)
      }
    })
  }
}
