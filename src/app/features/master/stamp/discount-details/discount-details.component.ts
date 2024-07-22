import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { GetStampDiscountDetails, AddStampDiscountDetails } from 'src/app/core/models/stamp';
import { ToastService } from 'src/app/core/services/toast.service';
import { DiscountDetailsService } from 'src/app/core/services/stamp/discount-details.service';
import { convertDate } from 'src/utils/dateConversion';
import { greaterThanZeroValidator } from 'src/utils/greaterThanZeroValidator';

@Component({
  selector: 'app-discount-details',
  templateUrl: './discount-details.component.html',
  styleUrls: ['./discount-details.component.scss'],
})
export class DiscountDetailsComponent implements OnInit {
  vendorType!: string;
  stampCategory!: string;
  vendorTypeId!: number;
  stampCategoryId!: number;
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetStampDiscountDetails>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  displayCalculateModal: boolean = false;
  displayInsertModal: boolean = false;
  CategoryTypeList: any[] = [];
  discountDetailsEntryForm!: FormGroup;
  calculateDiscountForm!: FormGroup;
  amount: number = 0;
  discount: string = '0';
  discountDetailsEntryPayload!: AddStampDiscountDetails;

  constructor(
    private fb: FormBuilder,
    private DiscountDetailsService: DiscountDetailsService,
    private toastService: ToastService,
  ) { }

  @Output() CategoryTypeSelected = new EventEmitter<string>();

  ngOnInit(): void {
    this.initializeForms();

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

    this.getAllStampDiscountDetails();
  }

  initializeForms() {
    this.calculateDiscountForm = this.fb.group({
      amount: [0, Validators.required],
      vendorType: ['', Validators.required],
      stampCategory: ['', Validators.required]
    });

    this.discountDetailsEntryForm = this.fb.group({
      denominationFrom: [0, [Validators.required, Validators.min(0)]],
      denominationTo: [0, [Validators.required]],
      discount: [null, [Validators.required, greaterThanZeroValidator()]]
    }, {
      validators: this.greaterThanValidator('denominationFrom', 'denominationTo')
    });
  }


  greaterThanValidator(fromControlName: string, toControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const formGroupControl = formGroup as FormGroup;
      const fromControl = formGroupControl.get(fromControlName);
      const toControl = formGroupControl.get(toControlName);

      if (!fromControl || !toControl) {
        return null; 
      }

      const fromValue = fromControl.value;
      const toValue = toControl.value;
      
      if (fromValue != null && toValue != null && toValue <= fromValue) {
        console.log("Hi=====>");
        
        return { greaterThan: true }; 
      }

      return null; 
    };
  }

  getAllStampDiscountDetails() {
    this.DiscountDetailsService
      .getStampDiscountDetailsList(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          response.result.data.map((item: any) => {
            item.isActive = item.isActive ? "Yes" : "No"
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

  showCalculateDialog() {
    this.displayCalculateModal = true;
  }

  showInsertDialog() {
    this.displayInsertModal = true;
  }

  handleButtonClick($event: any) {
    console.log($event);
    
    this.DiscountDetailsService.deleteStampDiscountDetail($event.rowData.discountId)
      .subscribe((response) => {
        response.apiResponseStatus == 1 ? this.getAllStampDiscountDetails() : this.toastService.showAlert(
          response.message,
          response.apiResponseStatus
        );

      });
  }

  onStampCategorySelected($event: any) {
    this.stampCategoryId = $event.stampCategoryId;
    this.stampCategory = $event.stampCategory1;
  }

  onVendorTypeSelected($event: any) {
    this.vendorType = $event.vendorType;
    this.vendorTypeId = $event.stampVendorId;
  }

  calculateDiscount() {
    this.amount = this.calculateDiscountForm.get('amount')?.value;
    const res = this.tableData.data.filter((item) => {
      return item.stampCategory == this.stampCategory && item.vendorType == this.vendorType && this.amount >= item.denominationFrom && this.amount <= item.denominationTo;
    });
    if (res.length > 0) {
      this.discount = res[0].discount + '%';
    } else {
      this.discount = "No Discount";
    }
  }

  addDiscountDetails() {

    if (this.discountDetailsEntryForm.valid) {
      this.discountDetailsEntryPayload = {
        StampCategoryId: this.stampCategoryId,
        vendorType: this.vendorTypeId,
        denominationFrom: this.discountDetailsEntryForm.value.denominationFrom,
        denominationTo: this.discountDetailsEntryForm.value.denominationTo,
        discount: this.discountDetailsEntryForm.value.discount,
      };
      console.log(this.discountDetailsEntryPayload);

      this.DiscountDetailsService.addNewStampDiscountDetail(this.discountDetailsEntryPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showAlert('Discount details added successfully', 1);
          this.displayInsertModal = false;
          this.getAllStampDiscountDetails();
        } else {
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
  }
}
