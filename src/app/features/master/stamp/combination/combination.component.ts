import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { AddStampCombination, GetStampCombinations } from 'src/app/core/models/stamp';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { StampMasterService } from 'src/app/core/services/stamp/stamp-master.service';
@Component({
  selector: 'app-combination',
  templateUrl: './combination.component.html',
  styleUrls: ['./combination.component.scss']
})
export class CombinationComponent implements OnInit {

  categoryId: any
  categoryDescription: string = "";
  labelId: any
  denominationId: any
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetStampCombinations>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  // combinationEntryForm!: FormGroup
  combinationEntryPayload!: AddStampCombination
  modal: boolean = false
  isLoading: boolean = false

  constructor(
    private stampMasterService: StampMasterService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) { }
  @Output() CategoryTypeSelected = new EventEmitter<string>();
  @Output() DenominatonSelected = new EventEmitter<string>();
  @Output() LabelSelected = new EventEmitter<string>();


  ngOnInit(): void {
    this.tableActionButton = [
      {
        buttonIdentifier: 'delete',
        class: 'p-button-danger p-button-sm',
        icon: 'pi pi-trash',
        lable: 'Delete',
      },
    ];

    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };

    this.getAllStampCombination();
  }



  getAllStampCombination() {
    this.isLoading = true;
    this.stampMasterService
      .getStampCombinationList(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          response.result.data.map((item: any) => {
            item.isActive = item.isActive ? "Yes" : "No";
            item.createdAt && (item.createdAt = convertDate(item.createdAt));
          });
          this.tableData = response.result;
        } else {
          this.toastService.showAlert(
            response.message,
            response.apiResponseStatus
          );
        }
      });
      this.isLoading = false
  }

  handleButtonClick($event: any) {
    this.stampMasterService.deleteStampCombination($event.rowData.stampCategoryId)
      .subscribe((response) => {
        response.apiResponseStatus == 1 ? this.getAllStampCombination() : this.toastService.showAlert(
          response.message,
          response.apiResponseStatus
        );
      });
  }

  displayInsertModal() {
    this.modal = true
  }

  addcombination() {

    if (this.categoryId && this.labelId && this.denominationId) {
      this.combinationEntryPayload = {
        stampCategoryId: this.categoryId,
        stampTypeId: this.denominationId,
        stampLabelId: this.labelId,
      };
      console.log(this.combinationEntryPayload);

      this.stampMasterService.addNewStampCombination(this.combinationEntryPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showSuccess(response.message);
          this.modal = false;
          this.getAllStampCombination();
        } else {
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
  }

  onStampCategorySelected($event: any) {
    this.categoryDescription = $event.description;
    this.categoryId = $event.stampCategoryId
  }

  onStampDenominationSelected($event: any) {
    this.denominationId = $event.denominationId
  }

  onStampLabelSelected($event: any) {
    this.labelId = $event.labelId
  }

}
