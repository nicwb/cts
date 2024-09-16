import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'src/app/core/models/dynamic-table';
import { GetStampDiscountDetails, AddStampDiscountDetails } from 'src/app/core/models/stamp';
import { ToastService } from 'src/app/core/services/toast.service';
import { DiscountDetailsService } from 'src/app/core/services/stamp/discount-details.service';
import { convertDate } from 'src/utils/dateConversion';

@Component({
    selector: 'app-discount-details',
    templateUrl: './discount-details.component.html',
    styleUrls: ['./discount-details.component.scss'],
})
export class DiscountDetailsComponent implements OnInit {
    vendorType!: string;
    stampCategory!: string;
    tableActionButton: ActionButtonConfig[] = [];
    tableData!: DynamicTable<GetStampDiscountDetails>;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    displayCalculateModal: boolean | undefined;
    displayInsertModal: boolean | undefined;
    CategoryTypeList: any[] = [];
    discountDetailsEntryForm!: FormGroup;
    calculateDiscountForm!: FormGroup;
    amount!: number;
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
          denominationFrom: [0, Validators.required],
          denominationTo: [0, Validators.required],
          discount: [0, Validators.required]
      });
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
      this.DiscountDetailsService.deleteStampDiscountDetail($event.rowData.stampVendorId)
          .subscribe((response) => {
              response.apiResponseStatus == 1 ? this.getAllStampDiscountDetails() : this.toastService.showAlert(
                  response.message,
                  response.apiResponseStatus
              );

          });
  }

  onStampCategorySelected($event: any) {
      this.stampCategory = $event;
  }

  onVendorTypeSelected($event: any) {
      this.vendorType = $event;
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
              stampCategory: this.stampCategory,
              vendorType: this.vendorType,
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
          this.toastService.showAlert('Please fill all the required fields', 0);
      }
  }
}
