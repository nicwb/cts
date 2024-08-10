import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DynamicTable,
  DynamicTableQueryParameters,
} from 'mh-prime-dynamic-table/lib/mh-prime-dynamic-table-interface';
import { debounceTime, Subject } from 'rxjs';
import { ActionButtonConfig } from 'src/app/core/models/dynamic-table';
import { ApprovedByClerk, StampRequisitions } from 'src/app/core/models/stamp';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DiscountDetailsService } from 'src/app/core/services/stamp/discount-details.service';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { StampWalletService } from 'src/app/core/services/stamp/stamp-wallet.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { StampCombinationDropdownComponent } from 'src/app/shared/modules/stamp-combination-dropdown/stamp-combination-dropdown.component';
import { convertDate } from 'src/utils/dateConversion';

@Component({
  selector: 'app-stamp-requisition-staging',
  templateUrl: './stamp-requisition-staging.component.html',
  styleUrls: ['./stamp-requisition-staging.component.scss'],
})
export class StampRequisitionStagingComponent implements OnInit {
  @ViewChild(StampCombinationDropdownComponent) stampComp: StampCombinationDropdownComponent | undefined;
  category: string = '';
  listType: string = 'new';
  discountAmount: number = 0;
  denomination: number = 0;
  taxAmount: number = 0;
  totalNetAmount: number = 0;
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
  approveByClerkPayload!: ApprovedByClerk
  reqNo: string = '';
  loading: boolean = false;
  netAmount: number = 0;
  vendorLicence: string = '';
  vendorName: string = '';
  stampCategoryId: number = 0;
  vendorTypeId: number = 0;
  vendorStampRequisitionId: number = 0
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
    private discountDetailsService: DiscountDetailsService
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
    if (this.listType === 'new') {
      this.tableActionButton = [
        {
          buttonIdentifier: 'reject',
          class: 'p-button-danger p-button-sm',
          icon: 'pi pi-times',
          lable: 'Reject',
        },
        {
          buttonIdentifier: 'edit',
          class: 'p-button-warning p-button-sm',
          icon: 'pi pi-file-edit',
          lable: 'Edit & Approve',
        },
      ];
      this.getAllNewRequisitions();
    } else if (this.listType === 'approvedByClerk') {
      this.tableActionButton = [];
      this.getAllApprovedByClerkRequisitions();
    }
  }

  calcAmountQuantity() {
    this.amount = Number(this.quantity) * this.denomination;
    if (this.vendorTypeId && this.stampCategoryId && this.amount) {
      this.getDiscount();
    }
  }

  getDiscount() {
    this.discountDetailsService
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
        this.stampRequisitionService
          .rejectedByStampClerk($event.rowData.id)
          .subscribe((response) => {
            if (response.apiResponseStatus == 1) {
              this.toastService.showSuccess(response.message);
              this.getAllNewRequisitions();
            } else {
              this.toastService.showError(response.message);
            }
          });
        break;
      case 'edit':
        console.log($event);
        this.modal = true;
        this.vendorStampRequisitionId = $event.rowData.id
        this.stamps = $event.rowData.childData;
        this.vendorLicence = $event.rowData.licenseNo;
        this.vendorName = $event.rowData.vendorName;
        this.vendorTypeId = $event.rowData.vendorTypeId;
        this.reqDate = $event.rowData.requisitionDate;
        this.reqNo = $event.rowData.requisitionNo;
        this.totalNetAmount = $event.rowData.netAmount;
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

  getAllNewRequisitions() {
    this.stampRequisitionService
      .newRequisitions(this.tableQueryParameters)
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          response.result.data.map((element: any) => {
            element.requisitionDate = convertDate(
              element.requisitionDate
            );
          });
          this.tableData = response.result;
        } else {
          this.toastService.showError(response.message);
        }
      });
  }
  getAllApprovedByClerkRequisitions() {
    this.stampRequisitionService
      .getAllRequisitionsForwardedToTOForApproval(
        this.tableQueryParameters
      )
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.tableData = response.result;
        } else {
          this.toastService.showError(response.message);
        }
      });
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
      this.discountDetailsService
        .getDiscount(this.vendorTypeId, stamp.stampCategoryId, grossAmount)
        .subscribe((response) => {
          if (response.apiResponseStatus == 1) {
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
          childData: data
        };
        console.log(this.approveByClerkPayload);

        this.stampRequisitionService.approveByClerk(this.approveByClerkPayload).subscribe((response) => {
          if (response.apiResponseStatus == 1) {
            this.toastService.showAlert(response.message, 1);
            this.modal = false;
            this.getAllNewRequisitions();
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
    this.stamps = this.stamps.filter((val) => val.combinationId !== stamp.combinationId);
  }
}
