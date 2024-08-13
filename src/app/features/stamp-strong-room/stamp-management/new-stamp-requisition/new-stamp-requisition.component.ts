import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { AddVendorStampRequisition } from 'src/app/core/models/stamp';
import { StampMasterService } from 'src/app/core/services/stamp/stamp-master.service';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { StampCombinationDropdownForRequisitionsComponent } from 'src/app/shared/modules/stamp-combination-dropdown-for-requisitions/stamp-combination-dropdown-for-requisitions.component';
import { VendorDetailsDropdownComponent } from 'src/app/shared/modules/vendor-details-dropdown/vendor-details-dropdown.component';

@Component({
  selector: 'app-new-stamp-requisition',
  templateUrl: './new-stamp-requisition.component.html',
  styleUrls: ['./new-stamp-requisition.component.scss']
})
export class NewStampRequisitionComponent implements OnInit {
  @ViewChild(StampCombinationDropdownForRequisitionsComponent) stampComp: StampCombinationDropdownForRequisitionsComponent | undefined;
  @ViewChild(VendorDetailsDropdownComponent) vendorComp: VendorDetailsDropdownComponent | undefined;
  minDateLimit: Date = new Date()
  vendorTypeId: number = 0
  description: string = ""
  category: string = ""
  vendorId: number = 0
  combinationId: number = 0
  stampCategoryId: number = 0
  denomination: number = 0
  discountAmount: number = 0
  taxAmount: number = 0.1 * this.discountAmount
  quantity: number = 0
  amount: number = this.quantity * this.denomination
  netAmount: number = this.amount - this.discountAmount + this.taxAmount;
  newStampRequisitionPayload!: AddVendorStampRequisition
  loading: boolean = false
  totalAmount: number = 0
  totalDiscountAmount: number = 0
  totalTaxAmount: number = 0
  totalNetAmount: number = 0
  labelPerSheet: number = 0
  stampList: any[] = []
  presentCategory: string = ""
  presentDenomination: number[] = []
  isVendorSelect: boolean = this.stampList.length === 0
  private quantitySubject = new Subject<number>();
  constructor(
    private stampRequisitionService: StampRequisitionService,
    private stampMasterService: StampMasterService,
    private toastService: ToastService) { }

  @Output() VendorDetailsSelected = new EventEmitter<any>();

  ngOnInit(): void {
    this.quantitySubject.pipe(
      debounceTime(1000)
    ).subscribe(() => this.calcAmountQuantity());
  }

  onStampCombinationSelected($event: any) {
    this.labelPerSheet = $event.noLabelPerSheet
    this.stampCategoryId = $event.stampCategoryId;
    this.combinationId = $event.stampCombinationId
    this.denomination = $event.denomination
    this.category = $event.stampCategory1
    this.calcAmountQuantity()
  }

  onVendorDetailsSelected($event: any) {
    this.vendorId = $event.stampVendorId
    this.vendorTypeId = $event.vendorTypeId
    this.calcAmountQuantity()
  }

  addStampRequisition() {
    if (this.stampList.length > 0) {
      const destructuredItems = this.stampList.map(({ stampCombinationId, labelPerSheet, netAmount, quantity, grossAmount, taxAmount, discountAmount }) => ({
        stampCombinationId,
        labelPerSheet,
        netAmount,
        taxAmount,
        discountAmount,
        quantity,
        grossAmount
      }));
      this.newStampRequisitionPayload = {
        vendorId: this.vendorId,
        totalGrossAmount: this.totalAmount,
        totalNetAmount: this.totalNetAmount,
        totalTaxAmount: this.totalTaxAmount,
        totalDiscountAmount: this.totalDiscountAmount,
        childData: destructuredItems,
      }
    }
    this.stampRequisitionService.addNewStampRequisition(this.newStampRequisitionPayload).subscribe((response) => {
      if (response.apiResponseStatus === 1) {
        this.toastService.showSuccess(response.message)
        this.stampList = []
        this.totalAmount = 0
        this.totalDiscountAmount = 0
        this.totalTaxAmount = 0
        this.totalNetAmount = 0
        this.vendorComp?.reset()
      } else {
        this.toastService.showError(response.message)
      }
    })
  }
  getDiscount() {
    this.stampMasterService.getDiscount(this.vendorTypeId, this.stampCategoryId, this.amount).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.discountAmount = response.result
        this.taxAmount = this.discountAmount * 0.1
        this.netAmount = this.amount - this.discountAmount + this.taxAmount
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    })
  }

  calcAmountQuantity() {
    this.amount = Number(this.quantity) * this.denomination
    if (this.vendorId && this.stampCategoryId && this.amount) {
      this.getDiscount()
    }
  }


  onQuantityChange(value: number) {
    if (value < 0 || value > 100000) {
      this.toastService.showWarning("Quantity should be greater than zero and less than 100000.");
      this.quantity = 0;
    } else {
      this.quantity = value;
      this.quantitySubject.next(value);
    }
  }


  addItems() {
    if (this.quantity > 0 && this.vendorId && this.combinationId) {
      let flag = false
      this.stampList.forEach((element) => {
        if (element.stampCombinationId === this.combinationId) {
          flag = true
          this.toastService.showWarning(`The category ${this.category} with denomination ${this.denomination} already added. Please add different combination.`)
          return
        }
      })

      if (flag == false) {
        const obj = {
          labelPerSheet: this.labelPerSheet,
          stampCombinationId: this.combinationId,
          stampCategoryId: this.stampCategoryId,
          category: this.category,
          denomination: this.denomination,
          quantity: this.quantity,
          grossAmount: this.amount,
          taxAmount: this.taxAmount,
          discountAmount: this.discountAmount,
          netAmount: this.netAmount,

        }

        this.totalAmount += this.amount
        this.totalDiscountAmount += this.discountAmount
        this.totalTaxAmount += this.taxAmount
        this.totalNetAmount += this.netAmount
        this.stampList.push(obj)
        this.presentCategory = this.category
        this.presentDenomination.push(this.denomination)
        this.stampComp?.removeCategory(this.category, this.presentDenomination)
        this.stampComp?.reset();
        this.category = ""
        this.denomination = 0
        this.quantity = 0
        this.amount = 0
        this.taxAmount = 0
        this.discountAmount = 0
        this.netAmount = 0
      }
      this.isVendorSelect = this.stampList.length === 0
    } else {
      this.toastService.showWarning("Quantity should be greater than zero and vendor and combination must be selected")
    }
  }

  deleteProduct(item: any) {
    this.totalAmount -= item.grossAmount
    this.totalDiscountAmount -= item.discountAmount
    this.totalNetAmount -= item.netAmount
    this.totalTaxAmount -= item.taxAmount
    this.stampList = this.stampList.filter((val) => val.stampCombinationId !== item.stampCombinationId)
    this.isVendorSelect = this.stampList.length === 0
    this.presentDenomination = this.presentDenomination.filter(e => e != item.denomination)
    if (this.stampList.length == 0) {
      this.presentCategory = ""
      this.stampComp?.reAssign()
    } else {
      this.stampComp?.removeCategory(this.presentCategory, this.presentDenomination)
    }
  }
}
