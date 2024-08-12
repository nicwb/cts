import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { StampRequisitionStatusEnum } from 'src/app/core/enum/stampRequisitionEnum';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'src/app/core/models/dynamic-table';
import { ApprovedByTO, StampRequisitions } from 'src/app/core/models/stamp';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { StampMasterService } from 'src/app/core/services/stamp/stamp-master.service';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { StampWalletService } from 'src/app/core/services/stamp/stamp-wallet.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { StampCombinationDropdownForRequisitionsComponent } from 'src/app/shared/modules/stamp-combination-dropdown-for-requisitions/stamp-combination-dropdown-for-requisitions.component';

@Component({
  selector: 'app-stamp-requisition-approval',
  templateUrl: './stamp-requisition-approval.component.html',
  styleUrls: ['./stamp-requisition-approval.component.scss']
})
export class StampRequisitionApprovalComponent implements OnInit {
  @ViewChild(StampCombinationDropdownForRequisitionsComponent) stampComp: StampCombinationDropdownForRequisitionsComponent | undefined;
  category: string = "";
  listType: string = 'forwarded';
  discountAmount: number = 0;
  denomination: number = 0;
  taxAmount: number = 0;
  totalTaxAmount: number = 0;
  totalNetAmount: number = 0;
  totalGrossAmount: number = 0;
  totalDiscountAmount: number = 0;
  quantity: number = 0;
  childQuantity: number = 0;
  availableQuantity: number = 0;
  combinationId: number = 0;
  amount: number = 0;
  challanAmount: number = 0;
  labelPerSheet: number = 0;
  modal: boolean = false;
  tableData!: DynamicTable<any>;
  tableActionButton: ActionButtonConfig[] = [];
  tableQueryParameters!: DynamicTableQueryParameters | any;
  approveByClerkPayload!: ApprovedByTO
  reqNo: string = '';
  loading: boolean = false;
  netAmount: number = 0;
  vendorLicence: string = '';
  vendorName: string = '';
  stampCategoryId: number = 0;
  vendorTypeId: number = 0;
  vendorStampRequisitionId: number = 0
  presentCategory: string = ""
  presentDenomination: number = 0
  reqDate: Date = new Date();
  clonedStamps: { [s: string]: StampRequisitions } = {};
  stamps: any[] = [];
  private quantitySubject = new Subject<number>();
  private childQuantitySubject = new Subject<any>();
  constructor(
    private stampRequisitionService: StampRequisitionService,
    private toastService: ToastService,
    private stampWalletService: StampWalletService,
    private authService: AuthService,
    private stampMasterService: StampMasterService
  ) { }

  ngOnInit(): void {
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.quantitySubject
      .pipe(debounceTime(1000))
      .subscribe(() => this.calcAmountQuantity());

    this.childQuantitySubject
      .pipe(debounceTime(1000))
      .subscribe(({ grossAmount, stamp }) => {
        this.childCalculations(grossAmount, stamp);
      });
    this.changeDynamicTable(this.listType);
  }

  changeDynamicTable(listType: string) {
    this.listType = listType;
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    if (this.listType === 'forwarded') {
      this.tableActionButton = [
        {
          buttonIdentifier: 'reject',
          class: 'p-button-danger p-button-sm',
          icon: 'pi pi-times',
          lable: 'Reject',
          renderButton: (rowData) => {
            return rowData.status == StampRequisitionStatusEnum.ForwardedToTreasuryOfficer
          }
        },
        {
          buttonIdentifier: 'edit',
          class: 'p-button-warning p-button-sm',
          icon: 'pi pi-file-edit',
          lable: 'Edit & Approve',
          renderButton: (rowData) => {
            return rowData.status == StampRequisitionStatusEnum.ForwardedToTreasuryOfficer
          }
        },
      ];
      this.getAllApprovedByClerkRequisitionsOrForwardedToTO()
    } else if (this.listType === 'waitingPaymentVerification') {

      this.tableActionButton = [
        {
          buttonIdentifier: 'approve',
          class: 'p-button-success p-button-sm',
          icon: 'pi pi-check-circle',
          lable: 'Approve',
          renderButton: (rowData) => {
            return rowData.status == StampRequisitionStatusEnum.WaitingForPaymentVerification
          }
        },
      ];
      this.getAllStampRequisitionWaitingForPaymentVerificatonByTO()
    }
  }
  calcAmountQuantity() {
    this.amount = Number(this.quantity) * this.denomination;
    if (this.vendorTypeId && this.stampCategoryId && this.amount) {
      this.getDiscount();
    }
  }

  getDiscount() {
    this.stampMasterService
      .getDiscount(this.vendorTypeId, this.stampCategoryId, this.amount)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.discountAmount = response.result;
          this.taxAmount = this.discountAmount * 0.1;
          this.netAmount =
            this.amount - this.discountAmount + this.taxAmount;
        } else {
          this.toastService.showAlert(
            response.message,
            response.apiResponseStatus
          );
        }
      });
  }
  handleButtonClick($event: any) {
    switch ($event.buttonIdentifier) {
      case 'reject':
        this.stampRequisitionService.rejectedByTO($event.rowData.vendorStampRequisitionId).subscribe((response) => {
          if (response.apiResponseStatus == 1) {
            this.toastService.showSuccess(response.message)
            this.getAllApprovedByClerkRequisitionsOrForwardedToTO()
          } else {
            this.toastService.showError(response.message)
          }
        })
        break;
      case 'edit':
        console.log($event);
        this.modal = true;
        this.totalGrossAmount = $event.rowData.grossAmount
        this.totalDiscountAmount = $event.rowData.discountAmount
        this.totalTaxAmount = $event.rowData.taxAmount
        this.totalNetAmount = $event.rowData.netAmount;
        this.vendorStampRequisitionId = $event.rowData.id
        this.stamps = $event.rowData.childData;
        this.presentCategory = $event.rowData.childData[0].stampCategory
        this.presentDenomination = $event.rowData.childData[0].denomination
        this.stampComp?.removeCategory(this.presentCategory, this.presentDenomination)
        this.vendorLicence = $event.rowData.licenseNo;
        this.vendorName = $event.rowData.vendorName;
        this.vendorTypeId = $event.rowData.vendorTypeId;
        this.reqDate = $event.rowData.requisitionDate;
        this.reqNo = $event.rowData.requisitionNo;
        this.stamps.map((item) => {
          this.getBalance(
            {
              treasuryCode:
                this.authService.getUserDetails().Level
                  .Scope[0],
              combinationId: item.stampCombinationId,
            },
            item
          );
        });
    }
  }
  getBalance(params: any, item?: any) {
    this.stampWalletService
      .getStampWalletBalanceByTreasuryCodeAndCombinationId({
        treasuryCode: params.treasuryCode,
        combinationId: params.combinationId,
      })
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          if (item) {
            item.availableQuantity = response.result.quantity;
          } else {
            this.availableQuantity = response.result.quantity;
          }
        } else {
          this.toastService.showError(response.message);
        }
      });
  }
  getAllApprovedByClerkRequisitionsOrForwardedToTO() {
    this.stampRequisitionService.getAllRequisitionsForwardedToTOForApproval(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.tableData = response.result;
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  getAllStampRequisitionWaitingForPaymentVerificatonByTO() {
    this.stampRequisitionService.getAllStampRequisitionWaitingForPaymentVerificatonByTO(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.tableData = response.result
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  getAmountCalculations(params: any) {
    this.stampRequisitionService.getCalcAmountDetails({
      vendorStampRequisitionId: params.vendorStampRequisitionId,
      sheet: params.sheet,
      label: params.label
    }).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.challanAmount = response.result.challanAmount
        this.taxAmount = response.result.taxAmount
        this.discountAmount = response.result.discountAmount
        this.amount = response.result.amount
        this.quantity = response.result.quantity
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  onQuantityChange(value: number) {
    if (value < 0 || value > 100000) {
      this.toastService.showWarning(
        'Quantity should be greater than zero and less than 100000.'
      );
      this.quantity = 0;
    } else {
      this.quantity = value;
      this.quantitySubject.next(value);
    }
  }

  onStampCombinationSelected($event: any) {
    console.log($event);

    this.labelPerSheet = $event.noLabelPerSheet
    this.combinationId = $event.stampCombinationId;
    this.stampCategoryId = $event.stampCategoryId;
    this.category = $event.stampCategory1;
    this.denomination = $event.denomination;
    this.getBalance({
      treasuryCode: this.authService.getUserDetails().Level.Scope[0],
      combinationId: this.combinationId,
    });
    this.calcAmountQuantity();
  }

  childQuantityChange($event: any, stamp: StampRequisitions) {
    if ($event >= 0 && $event <= stamp.availableQuantity) {
      stamp.quantity = $event;
      stamp.grossAmount = stamp.quantity * stamp.denomination;
      this.childQuantitySubject.next({ grossAmount: stamp.grossAmount, stampCategoryId: stamp.stampCategoryId, stamp: stamp });
    } else {
      this.toastService.showWarning(
        'Quantity should be greater than zero and less than Available Quantity.'
      );
    }
  }

  childCalculations(grossAmount: number, stamp: StampRequisitions) {
    if (grossAmount && stamp.stampCategoryId && stamp) {
      this.stampMasterService
      .getDiscount(this.vendorTypeId, stamp.stampCategoryId, grossAmount)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          console.log(this.vendorTypeId, stamp.stampCategoryId, grossAmount);
          
          console.log(response);
          
            stamp.discountAmount = response.result;
            stamp.taxAmount = stamp.discountAmount * 0.1;
            this.totalNetAmount -= stamp.netAmount
            stamp.netAmount = stamp.grossAmount - stamp.discountAmount + stamp.taxAmount;
            this.totalNetAmount += stamp.netAmount
          } else {
            this.toastService.showAlert(
              response.message,
              response.apiResponseStatus
            );
          }
        });
    }
  }
  addItems() {
    if (this.quantity <= this.availableQuantity && this.quantity > 0) {
      debugger
      let flag = false
      this.stamps.forEach((element) => {
        if (element.combinationId === this.combinationId) {
          flag = true
          this.toastService.showWarning(`The category ${this.category} with denomination ${this.denomination} already added. Please add different combination.`)
          return
        }
      })
      if (!flag) {

        const obj = {
          quantity: this.quantity,
          stampCategory: this.category,
          denomination: this.denomination,
          availableQuantity: this.availableQuantity,
          grossAmount: this.amount,
          discountAmount: this.discountAmount,
          taxAmount: this.taxAmount,
          netAmount: this.netAmount,
          labelPerSheet: this.labelPerSheet,
          stampCategoryId: this.stampCategoryId,
          combinationId: this.combinationId
        }

        this.stamps.push(obj)
        this.totalNetAmount += this.netAmount
        this.quantity = 0
        this.category = ""
        this.denomination = 0
        this.availableQuantity = 0
        this.amount = 0
        this.discountAmount = 0
        this.taxAmount = 0
        this.netAmount = 0
        this.stampComp?.reset();
      }
    } else {
      this.toastService.showWarning("Quantity should be greater than 0 and less than available quantity.")
    }
  }
  modifyRequisition() {
    this.loading = true
    if (this.vendorStampRequisitionId && this.stamps.length > 0) {
      let flag = false;
      let indexes = "";
      let data = this.stamps.map((element, index) => {
        const { stampCombinationId, labelPerSheet, netAmount, taxAmount, discountAmount, quantity, grossAmount } = element;

        if (quantity > element.availableQuantity || quantity < 0 || quantity == null) {
          flag = true;
          indexes += `${index + 1}, `;
        }

        return {
          stampCombinationId,
          labelPerSheet,
          netAmount,
          taxAmount,
          discountAmount,
          quantity,
          grossAmount
        };
      });

      if (!flag) {
        this.approveByClerkPayload = {
          vendorStampRequisitionId: this.vendorStampRequisitionId,
          requisitionNo: this.reqNo,
          totalDiscountAmount: this.totalDiscountAmount,
          totalGrossAmount: this.totalGrossAmount,
          totalNetAmount: this.totalNetAmount,
          totalTaxAmount: this.totalTaxAmount,
          childData: data
        };
        console.log(this.approveByClerkPayload);

        this.stampRequisitionService.approveByTO(this.approveByClerkPayload).subscribe((response) => {
          if (response.apiResponseStatus == 1) {
            this.toastService.showAlert(response.message, 1);
            this.modal = false;
            this.getAllApprovedByClerkRequisitionsOrForwardedToTO();
          } else {
            this.toastService.showAlert(response.message, response.apiResponseStatus);
          }
        });
        this.loading = false
      } else {
        indexes = indexes.trim().replace(/,\s*$/, "");
        this.toastService.showError(`Item ${indexes.substring(0, indexes.length)} has invalid number of quantity given`)
      }
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
    this.loading = false
  }
  onRowEditCancel(stamp: StampRequisitions, index: number) {
    this.stamps[index] = this.clonedStamps[stamp.id as number];
    delete this.clonedStamps[stamp.id as number];
  }
  onRowEditSave(stamp: StampRequisitions, index: number) {
    if (stamp.quantity != null && stamp.quantity != undefined && stamp.quantity > 0) {
      delete this.clonedStamps[stamp.id as number];
      this.toastService.showSuccess("Requisition Updated.")
    } else {
      this.toastService.showSuccess("Invalid Quantity.")
    }
  }
  onRowEditInit(stamp: StampRequisitions) {
    this.clonedStamps[stamp.id as number] = { ...stamp };
  }
  deleteProduct(stamp: StampRequisitions) {
    this.totalNetAmount -= stamp.netAmount
    this.stamps = this.stamps.filter((val) => val.stampCombinationId !== stamp.stampCombinationId);
    this.stampComp?.reAssign()
  }
}
