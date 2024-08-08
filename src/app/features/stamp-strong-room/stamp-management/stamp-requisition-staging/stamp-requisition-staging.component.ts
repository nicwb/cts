import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table/lib/mh-prime-dynamic-table-interface';
import { ActionButtonConfig } from 'src/app/core/models/dynamic-table';
import { ApprovedByClerk } from 'src/app/core/models/stamp';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { StampWalletService } from 'src/app/core/services/stamp/stamp-wallet.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';

@Component({
  selector: 'app-stamp-requisition-staging',
  templateUrl: './stamp-requisition-staging.component.html',
  styleUrls: ['./stamp-requisition-staging.component.scss']
})
export class StampRequisitionStagingComponent implements OnInit {

  id: number = 0
  denom: number = 0
  category: string = ""
  listType: string = 'new'
  sheet: number = 0
  label: number = 0
  discountAmount: number = 0
  denomination: number = 0
  noOfLabels: number = 0
  taxAmount: number = 0
  quantity: number = 0
  amount: number = 0
  challanAmount: number = 0
  noOfSheets: number = 0
  modal: boolean = false
  tableData!: DynamicTable<any>;
  tableActionButton: ActionButtonConfig[] = [];
  tableQueryParameters!: DynamicTableQueryParameters | any;
  approveByClerkPayload!: ApprovedByClerk
  approveByClerkForm!: FormGroup
  reqNo: string = ""
  loading: boolean = false
  netAmount: number = 0
  vendorLicence: string = ""
  vendorName: string = ""
  reqDate: Date = new Date()
  stamps: any[] = []
  constructor(private stampRequisitionService: StampRequisitionService,
    private toastService: ToastService,
    private fb: FormBuilder, private stampWalletService: StampWalletService) { }

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
        console.log($event);

        this.stampRequisitionService.rejectedByStampClerk($event.rowData.id).subscribe((response) => {
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
        this.getBalance({ treasuryCode: $event.rowData.raisedToTreasury, combinationId: $event.rowData.combinationId })
      // this.getAmountCalculations({vendorStampRequisitionId: $event.rowData.vendorStampRequisitionId, sheet: this.sheet, label: this.label})
    }
  }
  getBalance(params: any) {
    this.stampWalletService.getStampWalletBalanceByTreasuryCodeAndCombinationId({ treasuryCode: params.treasuryCode, combinationId: params.combinationId }).subscribe((response) => {
      console.log(response, params);
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
        response.result.data.map((element: any) => {
          element.requisitionDate = convertDate(element.requisitionDate)
        })
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
  addItems() {

  }
  onRowEditCancel(stamp: any, index: number) {

  }
  modifyRequisition() {

  }
  onRowEditSave(stamp: any, index: number){

  }
  onRowEditInit(stamp: any) {

  }

  deleteProduct(stamp: any){

  }
}
