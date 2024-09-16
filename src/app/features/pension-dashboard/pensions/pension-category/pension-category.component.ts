import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { AddStampIndent, GetStampIndents } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';

@Component({
    selector: 'app-pension-category',
    templateUrl: './pension-category.component.html',
    styleUrls: ['./pension-category.component.scss']
})
export class PensionCategoryComponent implements OnInit {

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
    private toastService: ToastService, 
    private stampIndentService: StampIndentService,
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


  showInsertDialog() {
      this.displayInsertModal = true;
  }
  handleButtonClick($event: any) { 
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

  addStampIndent() {
      this.displayInsertModal = false;    
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
}
