import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { AddStampInvoice, GetStampIndents, GetStampInvoices, Indent } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { StampInvoiceService } from 'src/app/core/services/stamp/stamp-invoice.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { StampWalletService } from 'src/app/core/services/stamp/stamp-wallet.service';
import { AuthTokenService } from 'src/app/core/services/auth/auth-token.service';
import { StampCombinationDropdownComponent } from 'src/app/shared/modules/stamp-combination-dropdown/stamp-combination-dropdown.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-invoice-capture',
  templateUrl: './invoice-capture.component.html',
  styleUrls: ['./invoice-capture.component.scss']
})
export class InvoiceCaptureComponent implements OnInit {

  @ViewChild(StampCombinationDropdownComponent) stampComp: StampCombinationDropdownComponent | undefined;

  isLoading: boolean = true
  tcode: string = ""
  sheetAsked: number = 0
  sheetGiven: number = 0
  labelAsked: number = 0
  labelGiven: number = 0
  labelPerSheet: number = 0;
  denomination: number = 0;
  description: string = "Eg: Court fees.";
  sheet: number = 0;
  label: number = 0;
  treasury: string = "";
  quantity: number = 0;
  amount: number = 0;
  memoNumber: string = "";
  memoDate!: Date;
  remarks: string = "";
  stampIndentId: number = 0;
  stamCombinationId!: number;
  listType: string = 'indent';
  stampInvoiceForm!: FormGroup;
  displayModifyModal!: boolean;
  displayDetailsModal!: boolean;
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetStampInvoices>;
  detailTableData!: DynamicTable<GetStampIndents>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  stampInvoiceEntryPayload!: AddStampInvoice
  indents: any[] = []
  noOfSheetsInStock: number = 0
  noOfLabelsInStock: number = 0
  inputSheet: number = 0
  inputLabel: number = 0
  category: string = ""
  loading: boolean = false
  clonedIndents: { [s: string]: Indent } = {};
  constructor(
    private stampInvoiceService: StampInvoiceService,
    private stampIndentService: StampIndentService,
    private stampWalletService: StampWalletService,
    private authTokenService: AuthTokenService,
    private messageService: MessageService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };

    this.changeDynamicTable(this.listType);
  }


  changeDynamicTable(type: string) {
    this.listType = type;
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    if (type === 'indent') {
      this.tableActionButton = [
        {
          buttonIdentifier: 'indent-reject',
          class: 'p-button-danger p-button-sm',
          icon: 'pi pi-times',
          lable: 'Reject',
        },
        {
          buttonIdentifier: 'indent-edit',
          class: 'p-button-warning p-button-sm',
          icon: 'pi pi-file-edit',
          lable: 'Edit & Approve',
        },
      ];
      this.getAllStampIndents();
    } else if (type === 'invoice') {
      this.tableActionButton = [
        {
          buttonIdentifier: 'invoice-details',
          class: 'p-button-info p-button-sm',
          icon: 'pi pi-info-circle',
          lable: 'Details',
        },
      ];
      this.getAllStampInvoices();
    }
  }

  getAllStampInvoices() {
    this.stampInvoiceService.getAllStampInvoice(this.tableQueryParameters).subscribe((response) => {
      console.log(response);
      if (response.apiResponseStatus == 1) {
        // response.result.data.map((item: any) => {
        //   item.createdAt = convertDate(item.createdAt);
        //   item.memoDate = convertDate(item.memoDate);
        //   item.invoiceDate = convertDate(item.invoiceDate)
        // });
        // this.tableData = response.result;
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    });
  }

  addStampInvoice() {
    this.loading = true
    if (this.stampIndentId && this.indents.length > 0) {
      let flag = false
      let indexes = ""
      this.indents.forEach((element, index) => {
        if ((element.sheet > element.availableSheet || element.sheet < 0 || element.label == null) || element.label > element.availableLabel || element.label < 0 || element.label == null) {
          flag = true
          indexes += `${index + 1},`
        }
      })

      if (!flag) {
        this.stampInvoiceEntryPayload = {
          indentId: this.stampIndentId,
          stampIndentData: this.indents
        };
        console.log(this.stampInvoiceEntryPayload);

        // this.stampInvoiceService.addNewStampInvoice(this.stampInvoiceEntryPayload).subscribe((response) => {
        //   if (response.apiResponseStatus == 1) {
        //     this.toastService.showAlert(response.message, 1);
        //     this.stampInvoiceForm.reset()
        //     this.displayModifyModal = false;
        //     this.getAllStampIndents();
        //   } else {
        //     this.toastService.showAlert(response.message, response.apiResponseStatus);
        //   }
        // });
        this.loading = false
      } else {
        this.toastService.showError(`Item ${indexes.substring(0, indexes.length)} has invalid number of sheets or label`)
      }
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
  }

  rejectIndent(id: number) {
    this.stampIndentService.rejectIndentByIndentId(id).subscribe((response) => {
      if (response.apiResponseStatus === 1) {
        this.toastService.showSuccess(response.message);
        this.changeDynamicTable('indent')
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    })
  }

  getAllStampIndents() {
    this.isLoading=true
    this.stampIndentService.getAllStampIndentsProcessing(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus === 1 || response.apiResponseStatus === 3) {
        response.result.data.map((item: any) => {
          item.createdAt = convertDate(item.createdAt);
          item.memoDate = convertDate(item.memoDate);
        });
        this.tableData = response.result;
        this.isLoading = false
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    });
  }

  getBalance(params: any, item: any) {
    this.stampWalletService.getStampWalletBalanceByTreasuryCodeAndCombinationId({ treasuryCode: params.treasuryCode, combinationId: params.combinationId }).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        item.availableSheet = response.result.sheetLedgerBalance
        item.availableLabel = response.result.labelLedgerBalance
      } else {
        this.toastService.showError(response.message)
      }
    })
  }

  getIndentDetailsById(rowData: any) {
    this.stampIndentService.getStampIndentDetails(rowData.stampIndentId).subscribe((response) => {
      if (response.apiResponseStatus === 1) {
        console.log(response.result);
        this.labelAsked = response.result.label
        this.labelGiven = rowData.label
        this.sheetAsked = response.result.sheet
        this.sheetGiven = rowData.sheet
        this.tcode = response.result.raisedByTreasuryCode
        this.stampInvoiceForm.setValue({
          noOfSheets: this.sheet,
          noOfLabels: this.label
        });
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    })
  }

  handleButtonClick($event: any) {
    switch ($event.buttonIdentifier) {
      case 'indent-reject':
        this.rejectIndent($event.rowData.id)
        break;
      case 'indent-edit':
        this.stampIndentId = $event.rowData.id
        this.indents = $event.rowData.childData
        this.memoNumber = $event.rowData.memoNumber;
        this.memoDate = $event.rowData.memoDate;
        this.treasury = $event.rowData.raisedByTreasuryCode;
        this.remarks = $event.rowData.remarks;
        this.indents.map((item) => {
          this.getBalance({ treasuryCode: this.authTokenService.getDecodeToken().Levels[0].Scope[0], combinationId: item.combinationId }, item)
        })
        this.displayModifyModal = true;
        this.calcAmountQuantity();
        break;
      case 'invoice-details':
        this.displayDetailsModal = true
        this.detailTableData = $event.rowData.indentData;
        console.log($event.rowData)
        break;
    }
  }

  calcAmountQuantity() {
    this.quantity = (this.labelPerSheet * this.inputSheet) + this.inputLabel;
    this.amount = this.quantity * this.denomination;
  }

  sheetSelected($event: any) {
    this.inputSheet = $event;
    this.calcAmountQuantity();
  }

  labelSelected($event: any) {
    this.inputLabel = $event;
    this.calcAmountQuantity();
  }

  onRowEditInit(indent: Indent) {
    this.clonedIndents[indent.id as number] = { ...indent }
  }

  onRowEditSave(indent: Indent, index: number) {


    if ((indent.label !== null && indent.label >= 0 && indent.label <= indent.availableLabel) && (indent.sheet !== null && indent.sheet >= 0 && indent.sheet <= indent.availableSheet)) {
      delete this.clonedIndents[indent.id as number];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Indent is updated' });
    } else {
      this.indents[index] = this.clonedIndents[indent.id as number];
      delete this.clonedIndents[indent.id as number];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Sheet or Label' });
    }
  }

  onRowEditCancel(indent: Indent, index: number) {
    this.indents[index] = this.clonedIndents[indent.id as number];
    delete this.clonedIndents[indent.id as number];

  }

  deleteProduct(item: any) {
    this.indents = this.indents.filter((val) => val.id !== item.id)

  }
  getBal(params: any) {
    this.stampWalletService.getStampWalletBalanceByTreasuryCodeAndCombinationId({ treasuryCode: params.treasuryCode, combinationId: params.combinationId }).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.noOfSheetsInStock = response.result.sheetLedgerBalance
        this.noOfLabelsInStock = response.result.labelLedgerBalance
      } else {
        this.toastService.showError(response.message)
      }
    })
  }
  onStampCombinationSelected($event: any) {
    if ($event) {
      this.category = $event.stampCategory1
      this.stamCombinationId = $event.stampCombinationId
      this.description = $event.description
      this.denomination = $event.denomination
      this.labelPerSheet = $event.noLabelPerSheet
      this.getBal({ treasuryCode: this.authTokenService.getDecodeToken().Levels[0].Scope[0], combinationId: this.stamCombinationId })
    }
  }
  addItems() {
    if (((this.inputSheet + this.inputLabel) > 0) && this.inputSheet >= 0 && this.inputLabel >= 0) {
      const obj = {
        stmapCategory: this.category,
        denomination: this.denomination,
        availableSheet: this.noOfSheetsInStock,
        availableLabel: this.noOfLabelsInStock,
        sheet: this.inputSheet,
        label: this.inputLabel,
        quantity: this.quantity,
        amount: this.amount,
      }
      console.log(obj);

      this.indents.push(obj)
      this.stamCombinationId = 0
      this.description = ""
      this.denomination =
        this.labelPerSheet = 0
      this.inputSheet = 0
      this.inputLabel = 0
      this.quantity = 0
      this.amount = 0
      this.category = ""
      this.noOfSheetsInStock = 0
      this.noOfLabelsInStock = 0
      this.stampComp?.reset();
    } else {
      this.toastService.showWarning("No. of sheets or labels should be greater than zero.")
    }
  }

  childSheetSelected($event: any, indent: Indent) {
    if ($event >= 0 && $event < indent.availableSheet) {
      indent.quantity = (indent.labelPerSheet * indent.sheet) + indent.label;
      indent.amount = indent.quantity * indent.denomination;
    }
  }

  childLabelSelected($event: any, indent: Indent) {
    if ($event >= 0 && $event < indent.availableLabel) {
      indent.quantity = (indent.labelPerSheet * indent.sheet) + indent.label;
      indent.amount = indent.quantity * indent.denomination;
    }
  }
}
