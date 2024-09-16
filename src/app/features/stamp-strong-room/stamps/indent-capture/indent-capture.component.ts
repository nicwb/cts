import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { AddStampIndent, GetStampIndents } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { convertDate } from 'src/utils/dateConversion';
import { error } from 'console';


@Component({
    selector: 'app-indent-capture',
    templateUrl: './indent-capture.component.html',
    styleUrls: ['./indent-capture.component.scss']
})
export class IndentCaptureComponent implements OnInit {

    labelPerSheet: number = 0
    denomination: number = 0
    description: string = "Eg: Court fees."
    sheet: number = 0
    label: number = 0
    raisedToTreasuryCode!: string
    quantity: number = (this.labelPerSheet * this.sheet) + this.label
    amount: number = this.quantity * this.denomination
    stamCombinationId!: number
    displayInsertModal?: boolean;
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
      // this.tableActionButton = [
      //   {
      //     buttonIdentifier: 'details',
      //     class: 'p-button-info p-button-sm',
      //     icon: 'pi pi-info-circle',
      //     lable: 'Details',
      //   },
      // ];
  }
  

  initializeForm(): void {
      this.stampIndentForm = this.fb.group({
          memoNo: ['', Validators.required],
          memoDate: ['', [Validators.required]],
          noOfSheets: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Validates integer
          noOfLabels: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Validates integer
          remarks: ['']
      });
  }

  getAllStampIndents() {
      this.stampIndentService
          .getAllStampIndents(this.tableQueryParameters)
          .subscribe((response) => {
              if (response.apiResponseStatus == 1) {
                  response.result.data.map((item: any) => {
                      item.createdAt = convertDate(item.createdAt);
                      item.memoDate = convertDate(item.memoDate);
                      item.status = Status[item.status]
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
      if (this.stampIndentForm.valid) {
          this.stampIndentPayload = {
              stampCombinationId: this.stamCombinationId,
              amount: this.amount,
              label: this.label,
              sheet: this.sheet,
              memoDate: this.stampIndentForm.value.memoDate,
              memoNumber: this.stampIndentForm.value.memoNo,
              quantity: this.quantity,
              remarks: this.stampIndentForm.value.remarks,
              raisedToTreasuryCode: this.raisedToTreasuryCode
          };
          console.log(this.stampIndentPayload);

          this.stampIndentService.addNewStampIndent(this.stampIndentPayload).subscribe((response) => {
              if (response.apiResponseStatus == 1) {
                  this.toastService.showSuccess(response.message);
                  this.stampIndentForm.reset()
                  this.displayInsertModal = false;
                  this.getAllStampIndents();
              } else {
                  this.toastService.showAlert(response.message, response.apiResponseStatus);
              }
          });
      } else {
          this.toastService.showAlert('Please fill all the required fields', 0);
      }
  }

  handleButtonClick($event: any) {
      console.log($event.rowData.stampIndentId);

      this.stampIndentService.getStampIndentDetails($event.rowData.stampIndentId)
          .subscribe((response) => {
              response.apiResponseStatus == 1 ? this.getAllStampIndents() : this.toastService.showAlert(
                  response.message,
                  response.apiResponseStatus
              );
          });
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

}
