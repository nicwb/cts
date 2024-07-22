import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { AddStampIndent, GetStampIndents, IndentItems } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';

@Component({
  selector: 'app-indent-capture',
  templateUrl: './indent-capture.component.html',
  styleUrls: ['./indent-capture.component.scss']
})
export class IndentCaptureComponent implements OnInit {

  indentList: IndentItems[] = []

  loading: boolean = false
  isLoading: boolean = false
  labelPerSheet: number = 0
  denomination: number = 0
  description: string = ""
  sheet: number = 0
  label: number = 0
  raisedToTreasuryCode!: string
  quantity: number = (this.labelPerSheet * this.sheet) + this.label
  amount: number = this.quantity * this.denomination
  stamCombinationId!: number
  displayInsertModal: boolean = false;
  stampIndentForm!: FormGroup
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetStampIndents>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  stampIndentPayload!: AddStampIndent

  constructor(
    private stampIndentService: StampIndentService,
    private toastService: ToastService,
    private fb: FormBuilder
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
      remarks: ['', [Validators.required, Validators.maxLength(20)]],
      indents: this.fb.group({
          noOfSheets: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
          noOfLabels: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        })
    });
  }

  get indents(): FormArray {
    return this.stampIndentForm.get('indents') as FormArray;
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
    // this.loading = true
    // if (this.stampIndentForm.valid) {
    //   this.stampIndentPayload = {
    //     memoDate: this.stampIndentForm.value.memoDate,
    //     memoNumber: this.stampIndentForm.value.memoNo,
    //     remarks: this.stampIndentForm.value.remarks,
    //     stampCombinationId: this.stamCombinationId,
    //     amount: this.amount,
    //     label: this.label,
    //     sheet: this.sheet,
    //     quantity: this.quantity,
    //     raisedToTreasuryCode: this.raisedToTreasuryCode
    //   };
    //   console.log(this.stampIndentPayload);

    //   this.stampIndentService.addNewStampIndent(this.stampIndentPayload).subscribe((response) => {
    //     if (response.apiResponseStatus == 1) {
    //       this.toastService.showSuccess(response.message);
    //       this.getAllStampIndents();
    //     } else {
    //       this.toastService.showAlert(response.message, response.apiResponseStatus);
    //     }
    //   });
    // } else {
    //   this.toastService.showWarning('Please fill all the required fields');
    // }
    // this.loading = false
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
  }
  addItems() {
    // const items = this.stampIndentForm.controls.indents as FormArray;
    // items.push(this.fb.group({
    //   combination: '',
    //   toTreasury: '',
    //   description: '',
    //   denomination: '',
    //   labelPerSheet: '',
    //   noOfSheets: '',
    //   noOfLabels: '',
    //   quantity: '',
    //   amount: '',
    // }));
    // console.log(items)
  }

}
