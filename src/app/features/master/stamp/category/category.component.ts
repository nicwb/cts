import { Component, OnInit } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { ToastService } from 'src/app/core/services/toast.service';
import { CategoryService } from 'src/app/core/services/stamp/category.service';
import { convertDate } from 'src/utils/dateConversion';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AddStampCategory, GetStampCategories } from 'src/app/core/models/stamp';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryEntryForm!: FormGroup;
  displayInsertModal: boolean = false;
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetStampCategories>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  categoryEntryPayload!: AddStampCategory

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm()
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

    this.getAllStampCategories();
  }

  initializeForm(): void {
    this.categoryEntryForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(10)]],
      stampCategory1: ['', [Validators.required, this.exactLengthValidator(2)]]
    });
  }

  exactLengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && value.length !== length) {
        return { exactLength: { requiredLength: length, actualLength: value.length } };
      }
      return null;
    };
  }

  getAllStampCategories() {
    this.categoryService
      .getStampLabelCategories(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          response.result.data.map((item: any) => {
            item.isActive = item.isActive ? "Yes" : "No";
            item.createdAt = convertDate(item.createdAt);
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

  handleButtonClick($event: any) {
    this.categoryService.deleteStampCategory($event.rowData.stampCategoryId)
      .subscribe((response) => {
        response.apiResponseStatus == 1 ? this.getAllStampCategories() : this.toastService.showAlert(
          response.message,
          response.apiResponseStatus
        );
      });
  }

  showInsertDialog() {
    this.displayInsertModal = true;
  }


  addCategory() {
    if (this.categoryEntryForm.valid) {
      this.categoryEntryPayload = {
        description: this.categoryEntryForm.value.description,
        stampCategory1: this.categoryEntryForm.value.stampCategory1.toUpperCase()
      };
      console.log(this.categoryEntryPayload);

      this.categoryService.addNewStampCategory(this.categoryEntryPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showAlert(response.message, 1);
          this.displayInsertModal = false;
          this.getAllStampCategories();
        } else {
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
  }
}
