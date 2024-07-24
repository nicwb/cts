import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddVendorStampRequisition } from 'src/app/core/models/stamp';
import { DiscountDetailsService } from 'src/app/core/services/stamp/discount-details.service';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-new-stamp-requisition',
  templateUrl: './new-stamp-requisition.component.html',
  styleUrls: ['./new-stamp-requisition.component.scss']
})
export class NewStampRequisitionComponent implements OnInit {
  minDateLimit: Date = new Date()
  vendorTypeId:number = 0
  treasuryCode: string = ""
  sheet: number = 0
  label: number = 0
  vendorId: any = null
  combinationId: any = null
  stampCategoryId: any = null
  discountAmount: number = 0
  denomination: number = 0
  noOfLabelsPerSheet: number = 0
  taxAmount: number = 0.1 * this.discountAmount
  quantity: number = (this.noOfLabelsPerSheet * this.sheet) + this.label
  amount: number = this.quantity * this.denomination
  challanAmount: number = this.amount - this.discountAmount + this.taxAmount;
  newStampRequisitionForm!: FormGroup
  newStampRequisitionPayload!: AddVendorStampRequisition
  constructor(
    private fb: FormBuilder, 
    private stampRequisitionService: StampRequisitionService, 
    private discountDetailsService: DiscountDetailsService, 
    private toastService: ToastService) { }

  @Output() VendorDetailsSelected = new EventEmitter<any>();

  ngOnInit(): void {
    this.initiaiozeForm()
  }

  initiaiozeForm() {
    this.newStampRequisitionForm = this.fb.group({
      sheet: [0, [Validators.required, Validators.min(0)]],
      label: [0, [Validators.required, Validators.min(0)]],
      requisitionDate: [null, Validators.required],
      requisitionNo: ['', Validators.required]
    });
  }

  // onTreasurySelected($event: any) {
  //   this.treasuryCode = $event
  // }

  onStampCombinationSelected($event: any) {
    
    this.combinationId = $event.stampCombinationId
    this.stampCategoryId = $event.stampCategoryId
    this.denomination = $event.denomination
    this.noOfLabelsPerSheet = $event.noLabelPerSheet
    this.calcAmountQuantity()
  }

  onVendorDetailsSelected($event: any) {
    this.vendorId = $event.stampVendorId
    this.vendorTypeId = $event.vendorTypeId
    this.treasuryCode = $event.vendorTreasury
    this.calcAmountQuantity()
  }

  addStampRequisition() {
    if (this.newStampRequisitionForm.valid) {
      this.newStampRequisitionPayload = {
        challanAmount: this.challanAmount,
        combinationId: this.combinationId,
        label: Number(this.newStampRequisitionForm.value.label),
        sheet: Number(this.newStampRequisitionForm.value.sheet),
        raisedToTreasury: this.treasuryCode,
        requisitionDate: this.newStampRequisitionForm.value.requisitionDate,
        requisitionNo: this.newStampRequisitionForm.value.requisitionNo,
        vendorId: this.vendorId
      };
      console.log(this.newStampRequisitionPayload);
      
      this.stampRequisitionService.addNewStampRequisition(this.newStampRequisitionPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showSuccess(response.message);
          // this.newStampRequisitionForm.reset()
        } else {
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
  }
  getDiscount() {
    this.discountDetailsService.getDiscount(this.vendorTypeId, this.stampCategoryId, this.amount).subscribe((response) => {
      if (response.apiResponseStatus == 1) {        
        this.discountAmount = response.result
        this.taxAmount = this.discountAmount * 0.1
        this.challanAmount = this.amount - this.discountAmount + this.taxAmount
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    })
  }
  calcAmountQuantity() {
    this.quantity = (this.noOfLabelsPerSheet * this.sheet) + this.label
    this.amount = this.quantity * this.denomination
    if (this.vendorId && this.stampCategoryId && this.amount) {
      this.getDiscount()
    }
  }
  labelSelected($event: any) {
    this.label = $event
    this.calcAmountQuantity()
  }

  sheetSelected($event: any) {
    this.sheet = $event
    this.calcAmountQuantity()
  }
}
