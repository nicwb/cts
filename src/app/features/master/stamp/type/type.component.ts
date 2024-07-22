import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { AddStampType, GetStampTypes } from 'src/app/core/models/stamp';
import { TypeService } from 'src/app/core/services/stamp/type.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { greaterThanZeroValidator } from 'src/utils/greaterThanZeroValidator';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {

  typeEntryForm!: FormGroup
  displayInsertModal: boolean | undefined;
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetStampTypes>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  typeEntryPayload!: AddStampType
  constructor(
    private fb: FormBuilder,
    private TypeService: TypeService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.initializeForm()
    this.tableActionButton = [
      // {
      //   buttonIdentifier: 'edit',
      //   class: 'p-button-warning p-button-sm',
      //   icon: 'pi pi-file-edit',
      //   lable: 'Edit',
      // },
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
    this.getAllStampTypes();
  }

  initializeForm(): void {
    this.typeEntryForm = this.fb.group({
      denomination: [null, [Validators.required, greaterThanZeroValidator()]]
    });
  }


  getAllStampTypes() {
    this.TypeService
      .getStampTypeList(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
            response.result.data.map((item:any) => {
            item.isActive = item.isActive ? "Yes" : "No"
            item.createdAt = convertDate(item.createdAt)
          })
          this.tableData = response.result;
        } else {
          this.toastService.showAlert(
            response.message,
            response.apiResponseStatus
          );
        }
      });
  }

  handleButtonClick($event: any) {
    this.TypeService.deleteStampType($event.rowData.denominationId)
      .subscribe((response) => {
        response.apiResponseStatus == 1 ? this.getAllStampTypes() : this.toastService.showAlert(
          response.message,
          response.apiResponseStatus
        );

      });
  }

  showInsertDialog() {
    this.displayInsertModal = true;
  }

  addType() {
    if (this.typeEntryForm.valid) {
      this.typeEntryPayload = {
        denomination: this.typeEntryForm.value.denomination
      };
      console.log(this.typeEntryPayload);

      this.TypeService.addNewStampType(this.typeEntryPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showAlert('Stamp Type added successfully', 1);
          this.displayInsertModal = false;
          this.getAllStampTypes();
        } else {
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
  }
}
