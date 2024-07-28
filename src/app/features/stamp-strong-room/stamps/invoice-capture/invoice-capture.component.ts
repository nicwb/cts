import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { AddStampInvoice, GetStampInvoices } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { StampInvoiceService } from 'src/app/core/services/stamp/stamp-invoice.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { convertDate } from 'src/utils/dateConversion';

@Component({
  selector: 'app-invoice-capture',
  templateUrl: './invoice-capture.component.html',
  styleUrls: ['./invoice-capture.component.scss']
})
export class InvoiceCaptureComponent implements OnInit {

  isLoading: boolean = true
  minDate: Date = new Date()
  noOfLabelsPerSheet: number = 0
  noOfSheets: number = 0
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
  combination: string = "";
  treasury: string = "";
  quantity: number = 0;
  amount: number = 0;
  memoNumber: string = "";
  memoDate!: Date;
  remarks: string = "";
  stampIndentId: number = -1;
  stamCombinationId!: number;
  listType: string = 'indent';
  stampInvoiceForm!: FormGroup;
  displayModifyModal!: boolean;
  displayDetailsModal!: boolean;
  tableActionButton: ActionButtonConfig[] = [];
  tableData!: DynamicTable<GetStampInvoices>;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  stampInvoiceEntryPayload!: AddStampInvoice
  products: any[] = []

  constructor(
    private stampInvoiceService: StampInvoiceService,
    private stampIndentService: StampIndentService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };

    // this.getAllStampIndents();
    this.changeDynamicTable(this.listType);
    this.initializeForm();
    this.products = [
      {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
      },
      {
        id: '1001',
        code: 'nvklal433',
        name: 'Black Watch',
        description: 'Product Description',
        image: 'black-watch.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 61,
        inventoryStatus: 'OUTOFSTOCK',
        rating: 4
      },
      {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Blue Band',
        description: 'Product Description',
        image: 'blue-band.jpg',
        price: 79,
        category: 'Fitness',
        quantity: 2,
        inventoryStatus: 'LOWSTOCK',
        rating: 3
      }
    ]
  }

  initializeForm(): void {
    this.stampInvoiceForm = this.fb.group({
      noOfSheets: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      noOfLabels: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      invoiceNumber: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]]
    });
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
      if (response.apiResponseStatus === 1 || response.apiResponseStatus === 3) {
        response.result.data.map((item: any) => {
          item.createdAt = convertDate(item.createdAt);
          item.memoDate = convertDate(item.memoDate);
          item.invoiceDate = convertDate(item.invoiceDate)
        });
        this.tableData = response.result;
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    });
  }

  addStampInvoice() {
    if (this.stampInvoiceForm.valid) {
      this.stampInvoiceEntryPayload = {
        amount: this.amount,
        quantity: this.quantity,
        stampIndentId: this.stampIndentId,
        label: this.stampInvoiceForm.value.noOfLabels,
        sheet: this.stampInvoiceForm.value.noOfSheets,
        invoiceDate: this.stampInvoiceForm.value.invoiceDate,
        invoiceNumber: this.stampInvoiceForm.value.invoiceNumber
      };
      console.log(this.stampInvoiceEntryPayload);

      this.stampInvoiceService.addNewStampInvoice(this.stampInvoiceEntryPayload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showAlert(response.message, 1);
          this.stampInvoiceForm.reset()
          this.displayModifyModal = false;
          this.getAllStampIndents();
        } else {
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
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
    this.isLoading = true
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
        this.rejectIndent($event.rowData.stampIndentId)
        break;
      case 'indent-edit':
        this.displayModifyModal = true;
        this.denomination = $event.rowData.denomination;
        this.memoNumber = $event.rowData.memoNumber;
        this.memoDate = $event.rowData.memoDate;
        this.label = $event.rowData.label;
        this.labelPerSheet = $event.rowData.labelPerSheet;
        this.description = $event.rowData.description;
        this.treasury = $event.rowData.raisedToTreasuryCode;
        this.sheet = $event.rowData.sheet;
        this.remarks = $event.rowData.remarks;
        this.stampIndentId = $event.rowData.stampIndentId;
        this.combination = `Category: ${$event.rowData.stmapCategory} | Description: ${$event.rowData.description} | Denomination: ${$event.rowData.denomination} | No of Labels per Sheet: ${$event.rowData.labelPerSheet}`;
        this.calcAmountQuantity();
        break;
      case 'invoice-details':
        this.displayDetailsModal = true
        this.getIndentDetailsById($event.rowData)
        break;
    }
  }

  calcAmountQuantity() {
    this.quantity = (this.labelPerSheet * this.sheet) + this.label;
    this.amount = this.quantity * this.denomination;
  }

  sheetSelected($event: any) {
    this.sheet = $event;
    this.calcAmountQuantity();
  }

  labelSelected($event: any) {
    this.label = $event;
    this.calcAmountQuantity();
  }

  onRowEditInit(product: any) {
  }

  onRowEditSave(product: any) {

  }

  onRowEditCancel(product: any, index: number) {

  }


}
