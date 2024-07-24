import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { AddStampIndent, GetStampIndents, IndentItems } from 'src/app/core/models/stamp';
import { AuthTokenService } from 'src/app/core/services/auth/auth-token.service';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { StampWalletService } from 'src/app/core/services/stamp/stamp-wallet.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { StampCombinationDropdownComponent } from 'src/app/shared/modules/stamp-combination-dropdown/stamp-combination-dropdown.component';
import { convertDate } from 'src/utils/dateConversion';

@Component({
  selector: 'app-indent-capture',
  templateUrl: './indent-capture.component.html',
  styleUrls: ['./indent-capture.component.scss']
})
export class IndentCaptureComponent implements OnInit {

  @ViewChild(StampCombinationDropdownComponent) stampComp: StampCombinationDropdownComponent | undefined;

  indentList: IndentItems[] = []
  category: string = ""
  denom: number = 0
  noOfSheetsInStock: number = 0
  noOfLabelsInStock: number = 0
  minDate: Date = new Date()
  loading: boolean = false
  isLoading: boolean = false
  labelPerSheet: number = 0
  denomination: number = 0
  description: string = ""
  sheet: number = 0
  label: number = 0
  sheetNegative: boolean = false
  sheetEmpty: boolean = false
  labelNegative: boolean = false
  labelEmpty: boolean = false
  raisedToTreasuryCode: string = 'CAA'
  quantity: number = (this.labelPerSheet * this.sheet) + this.label
  amount: number = this.quantity * this.denomination
  stamCombinationId!: number
  displayInsertModal: boolean = false;
  stampIndentForm!: FormGroup
  common!: FormGroup
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetStampIndents>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  stampIndentPayload!: AddStampIndent

  constructor(
    private stampIndentService: StampIndentService,
    private toastService: ToastService,
    private stampWalletService: StampWalletService,
    private fb: FormBuilder,
    private authTokenService: AuthTokenService
  ) { }

  @Output() StampCombinationSelected = new EventEmitter<any>();

  ngOnInit(): void {
    this.initializeForm()

    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };

    this.getAllStampIndents();
  }

  initializeForm(): void {
    this.stampIndentForm = this.fb.group({
      memoNo: ['', Validators.required],
      memoDate: ['', Validators.required],
      remarks: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  getAllStampIndents() {
    this.isLoading = true
    this.stampIndentService
      .getAllStampIndents(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          response.result.data.map((item: any) => {
            item.createdAt = convertDate(item.createdAt);
            item.memoDate = convertDate(item.memoDate);
            this.isLoading = false
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

  showInsertDialog() {
    this.displayInsertModal = true;
  }

  addStampIndent() {
    this.loading = true
    if (this.stampIndentForm.valid && this.indentList.length > 0) {
      const destructuredItems = this.indentList.map(({ stampCombinationId, sheet, label, quantity, amount }) => ({
        stampCombinationId,
        sheet,
        label,
        quantity,
        amount
      })); this.stampIndentPayload = {
        memoDate: this.stampIndentForm.value.memoDate,
        memoNumber: this.stampIndentForm.value.memoNo,
        remarks: this.stampIndentForm.value.remarks,
        raisedToTreasuryCode: this.raisedToTreasuryCode,
        items: destructuredItems
      };
      console.log(this.stampIndentPayload);

      // this.stampIndentService.addNewStampIndent(this.stampIndentPayload).subscribe((response) => {
      //   if (response.apiResponseStatus == 1) {
      //     this.toastService.showSuccess(response.message);
      //     this.getAllStampIndents();
      //   } else {
      //     this.toastService.showAlert(response.message, response.apiResponseStatus);
      //   }
      // });
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
    this.loading = false
  }

  handleButtonClick($event: any) {
    this.tableQueryParameters = $event
  }

  calcAmountQuantity() {
    this.quantity = (this.labelPerSheet * this.sheet) + this.label
    this.amount = this.quantity * this.denomination
  }

  sheetSelected($event: any) {
    this.sheet = $event
    this.calcAmountQuantity()
  }

  labelSelected($event: any) {
    this.label = $event
    this.calcAmountQuantity()
  }

  onTreasurySelected($event: any) {
    this.raisedToTreasuryCode = $event;
  }

  onStampCombinationSelected($event: any) {
    this.stamCombinationId = $event.stampCombinationId
    this.description = $event.description
    this.denomination = $event.denomination
    this.labelPerSheet = $event.noLabelPerSheet
    this.getBalance({ treasuryCode: this.authTokenService.getDecodeToken().Levels[0].Scope[0], combinationId: this.stamCombinationId })
  }
  addItems() {
    if ((this.sheet || this.label) || (this.sheet < 0 || this.label < 0)) {
      const obj = {
        stampCombinationId: this.stamCombinationId,
        description: this.description,
        denomination: this.denomination,
        labelPerSheet: this.labelPerSheet,
        sheet: this.sheet,
        label: this.label,
        quantity: this.quantity,
        amount: this.amount,
      }
      this.indentList.push(obj)
      this.stamCombinationId = 0
      this.description = ""
      this.denomination =
        this.labelPerSheet = 0
      this.sheet = 0
      this.label = 0
      this.quantity = 0
      this.amount = 0
      this.category = ""
      this.denom = 0
      this.noOfSheetsInStock = 0
      this.noOfLabelsInStock = 0
      this.stampComp?.reset();
    } else {
      this.toastService.showWarning("No. of sheets or labels should be greater than zero.")
    }
  }
  getBalance(params: any) {
    this.stampWalletService.getStampWalletBalanceByTreasuryCodeAndCombinationId({ treasuryCode: params.treasuryCode, combinationId: params.combinationId }).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.denom = response.result.denomination
        this.noOfSheetsInStock = response.result.sheetLedgerBalance
        this.noOfLabelsInStock = response.result.labelLedgerBalance
        this.category = response.result.category
      } else {
        this.toastService.showError(response.message)
      }
    })
  }
}
