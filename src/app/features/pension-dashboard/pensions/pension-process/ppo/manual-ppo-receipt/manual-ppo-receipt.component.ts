import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters, TableHeader } from 'mh-prime-dynamic-table';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { PensionManualPPOReceiptService, ManualPpoReceiptEntryDTO, ManualPpoReceiptResponseDTO, DateOnly } from 'src/app/api';
import { error } from 'console';

interface expandedRows {
  [key: string]: boolean;
}



@Component({
  selector: 'app-manual-ppo-receipt',
  templateUrl: './manual-ppo-receipt.component.html',
  styleUrls: ['./manual-ppo-receipt.component.scss']
})
export class ManualPpoReceiptComponent implements OnInit {
  expandedRows: expandedRows = {};
  displayInsertModal: boolean = false;
  manualPpoForm!: FormGroup;
  tableQueryParameters!: DynamicTableQueryParameters  | any;
  tableActionButton: ActionButtonConfig[] = [];
  tableChildActionButton: ActionButtonConfig[] = [];
  tableData: any;
  count: number = 0;
  isTableDataLoading: boolean = false;
  treasuryReceiptId!: string;
  selectedRowData: ManualPpoReceiptResponseDTO | null = null;
  selectedRow: any;
  ppoIssuedBy: SelectItem[] = [];
  type: SelectItem[] = [];
  selectedDrop: SelectItem = { value: '' };
  rowData: any;

  constructor(
    private datePipe: DatePipe,
    private toastService: ToastService,
    private pensionManualPpoReceiptService : PensionManualPPOReceiptService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  @Output() ManualPpoReceiptCombinationSelected = new EventEmitter<any>();

  ngOnInit(): void {
    this.initializeForm();
    this.ppoIssuedBy = [
      { label: 'AGWB', value: 'A' },
      { label: 'DPPGWG', value: 'D' },
      { label: 'Other', value: 'O' }
    ];

    this.type = [
      { label: 'New PPO', value: 'N' },
      { label: 'Revise PPO', value: 'R' },
      { label: 'PSA Sanction', value: 'P' },
      { label: 'Other', value: 'O' }
    ];
    this.tableActionButton = [
      {
        buttonIdentifier: 'edit',
        class: 'p-button-rounded p-button-raised',
        icon: 'pi pi-pencil',
        lable: 'Edit',
      },
    ];
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.getData();
  }



  showInsertDialog() {
    this.displayInsertModal = true;
    this.manualPpoForm.reset();
  }

  handleButtonClick($event: any) {
    console.log('Button clicked:', $event);

    if ($event.buttonIdentifier === 'edit') {
        this.EditInit($event.rowData);
    }

}

  handleRowSelection($event: any) {
    console.log('Row selected:', $event);
  }

  handQueryParameterChange(event: any) {
    console.log('Query parameter changed:', event);
    this.tableQueryParameters = {
      pageSize: event.pageSize,
      pageIndex: event.pageIndex,
      filterParameters: event.filterParameters || [],
      sortParameters: event.sortParameters
    }
    console.log(this.tableQueryParameters.pageSize);

    this.getAllManualPpoReceipt(this.tableQueryParameters);
  }

  handsearchKeyChange(event: string): void {
    console.log('Search key changed:', event);
    this.tableQueryParameters.filterParameters = [
      { field: 'searchKey', value: event }
    ];
    this.getAllManualPpoReceipt(this.tableQueryParameters, event);
  }


  initializeForm(): void {
    this.manualPpoForm = this.fb.group({
      ppoNo: ['', [Validators.required, Validators.maxLength(100)]],
      pensionerName: ['', Validators.maxLength(100)],
      dateOfCommencement: ['', Validators.required],
      mobileNumber: ['', [Validators.pattern('^[6-9]\\d{9}$')]],
      receiptDate: ['', Validators.required],
      psaCode: ['', [Validators.required, Validators.pattern('[ADO]')]],
      ppoType: ['', [Validators.required, Validators.pattern('[NRPO]')]]
    });
  }

  clear(table: any) {
    table.clear();
  }

  onGlobalFilter(dt: any, event: any): void {
    if (event && event.target) {
      const input = event.target as HTMLInputElement;
      dt.filterGlobal(input.value, 'contains');
    }
  }

  // Add Manual PPO Receipt
  addManualPpoReceipt() {
    if (this.manualPpoForm.valid) {
      const formData = this.manualPpoForm.value;

      if (formData.receiptDate && formData.dateOfCommencement) {
        formData.dateOfCommencement = this.datePipe.transform(formData.dateOfCommencement, 'yyyy-MM-dd');
        formData.receiptDate = this.datePipe.transform(formData.receiptDate, 'yyyy-MM-dd');
      }

      console.log('Form Data:', formData);

      this.pensionManualPpoReceiptService.createPpoReceipt(formData).subscribe(
        response => {
          if (response.apiResponseStatus === 1) {  // Assuming 1 means success
            console.log('Form submitted successfully:', response);
            this.getAllManualPpoReceipt(this.tableQueryParameters);
            this.displayInsertModal = false;  // Close the dialog
            this.toastService.showSuccess('PPO Receipt added successfully');
          } else {
            this.handleErrorResponse(response);
          }
        },
        error => {
          console.error('Error submitting form:', error);
          this.handleErrorResponse(error.error);
        }
      );
    } else {
      console.log('Form is not valid. Cannot submit.');
      this.toastService.showError('Please fill all required fields correctly.');
    }
  }

  private handleErrorResponse(response: any) {
    if (response.message && response.message.includes('duplicate key value violates unique constraint')) {
      this.toastService.showError('This PPO number already exists. Please use a different PPO number.');
      this.manualPpoForm.get('ppoNo')?.setErrors({ 'duplicate': true });
    } else {
      this.toastService.showError(response.message || 'An unexpected error occurred. Please try again.');
    }
  }

  resetForm() {
    this.manualPpoForm.reset();
  }

  // Get Manual PPO Receipt By Id
  getManualPpoReceiptByTreasuryReceiptNo(treasuryReceiptNo: string | null | undefined) {
  if (treasuryReceiptNo) {
    console.log('Fetching Manual PPO Receipt By Id...');
    this.pensionManualPpoReceiptService.getPpoReceiptByTreasuryReceiptNo(treasuryReceiptNo.toString())
      .subscribe((response) => {
        console.log('API Response:', response);
        if (response.apiResponseStatus === 1) {
          this.tableData = response.result;
        } else {
          this.toastService.showAlert(response.message || 'An unexpected error occurred', response.apiResponseStatus || 0);
        }
      });
  } else {
    console.log('treasuryReceiptNo is null or undefined');
    // Handle the case where treasuryReceiptNo is null or undefined
    this.toastService.showAlert('treasuryReceiptNo is null or undefined', 0);
  }
}

  // Get All Manual PPO Receipt
  getAllManualPpoReceipt(tableQueryParameters: DynamicTableQueryParameters, treasuryReceiptNo?: string) {
    this.isTableDataLoading = true;
    if (treasuryReceiptNo) {
      this.pensionManualPpoReceiptService.getPpoReceiptByTreasuryReceiptNo(treasuryReceiptNo).subscribe(
        (response: any) => {
          console.log('API Responsef for update:', response);
          this.isTableDataLoading = false;
          if (response && response.apiResponseStatus === 1 && response.result!==null) {
            const updatedData = [response.result].map((item: any) => ({
              ...item,
              receiptDate: convertDate(item.receiptDate)
            }));
            this.tableData = { headers: this.tableData.headers, data: updatedData, dataCount: updatedData.length };
          } else {
            this.toastService.showError(response?.result || 'An error occurred');
            console.error("Error: ", response?.message || 'An error occurred', response?.apiResponseStatus || 0);
          }
          
          this.toastService.showAlert(response?.message || 'An error occurred', response?.apiResponseStatus || 0);
          this.cd.detectChanges();
        },
        (error) => {
          this.isTableDataLoading = false;
          console.error('API Error:', error);
          this.toastService.showAlert('An error occurred while fetching data', 0);
        }
      );
    } else {
      console.log("tableQueryParameters: "+tableQueryParameters);
      this.pensionManualPpoReceiptService.getAllPpoReceipts(tableQueryParameters).subscribe(
        (response: any) => {
          this.isTableDataLoading = false;
          if (response && response.apiResponseStatus === 1 && response.result) {
            const updatedData = response.result.data.map((item: any) => ({
              ...item,
              receiptDate: convertDate(item.receiptDate)
            }));
            this.tableData = { ...response.result, data: updatedData };
          } else {
            this.toastService.showAlert(response?.message || 'An error occurred', response?.apiResponseStatus || 0);
          }
          this.cd.detectChanges();
        },
        (error) => {
          this.isTableDataLoading = false;
          console.error('API Error:', error);
          this.toastService.showAlert('An error occurred while fetching data', 0);
        }
      );
    }
  }

  getData() {
    this.isTableDataLoading = true;
    this.pensionManualPpoReceiptService.getAllPpoReceipts(this.tableQueryParameters).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.tableData = response.result;
        this.isTableDataLoading = false;
      },
      (error) => {
        this.isTableDataLoading = false;
        console.error('API Error:', error);
        this.toastService.showAlert('An error occurred while fetching data', 0);
      }
    );
  }

  EditInit(rowData: any): void {
    console.log('EditInit called with rowData:', rowData);
    this.selectedRow = rowData;
    const treasuryReceiptId: string = this.selectedRow.treasuryReceiptNo;
    console.log('Treasury Receipt ID:', treasuryReceiptId);

    this.pensionManualPpoReceiptService.getPpoReceiptByTreasuryReceiptNo(treasuryReceiptId).subscribe({
        next: response => {
            if (response.result) {
                console.log('Fetched DTO:', response);

                const dateOfCommencement = this.convertToDate(response.result.dateOfCommencement);
                const receiptDate = this.convertToDate(response.result.receiptDate);

                this.manualPpoForm.patchValue({
                  ppoNo: response.result.ppoNo,
                  pensionerName: response.result.pensionerName,
                  dateOfCommencement: dateOfCommencement,
                  mobileNumber: response.result.mobileNumber,
                  receiptDate: receiptDate,
                  psaCode: response.result.psaCode,
                  ppoType: response.result.ppoType
              });
              
                console.log('Form Values:', this.manualPpoForm.value);
                this.displayInsertModal = true;
            } else {
                this.toastService.showError('No PPO receipt details found.');
            }
        },
        error: err => {
            this.toastService.showError('Failed to fetch PPO receipt details.');
        }
    });
}

private convertToDate(dateOnly: any): Date | null {
  if (!dateOnly) {
      return null;
  }
  
  if (dateOnly instanceof Date) {
      return dateOnly;
  }
  if (typeof dateOnly === 'string') {
      const parsedDate = new Date(dateOnly);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  const { year, month, day } = dateOnly;
  if (year && month && day) {
      return new Date(year, month - 1, day); 
  }
  return null;
}






  // Update Manual PPO Receipt
  updateManualPpoReceipt(selectedRow: any) {
  console.log('Selected Row:', this.selectedRow);
  console.log('Form Data:', this.manualPpoForm.value);
  if (this.selectedRow && this.manualPpoForm.valid) {
    const formData = this.manualPpoForm.value;
    if (formData.dateOfCommencement && formData.receiptDate) {
      formData.dateOfCommencement = this.datePipe.transform(formData.dateOfCommencement, 'yyyy-MM-dd');
      formData.receiptDate = this.datePipe.transform(formData.receiptDate, 'yyyy-MM-dd');
    }
    const updateDto: ManualPpoReceiptResponseDTO = {
      ppoNo: formData.ppoNo,
      pensionerName: formData.pensionerName,
      dateOfCommencement: formData.dateOfCommencement,
      mobileNumber: formData.mobileNumber,
      receiptDate: formData.receiptDate,
      psaCode: formData.psaCode,
      ppoType: formData.ppoType
    };
    this.pensionManualPpoReceiptService.updatePpoReceiptByTreasuryReceiptNo(this.selectedRow.treasuryReceiptNo, updateDto).subscribe(
      response => {
        console.log('Update successful:', response);
        this.toastService.showSuccess('PPO Receipt updated successfully');
        this.getAllManualPpoReceipt(this.tableQueryParameters);  // Refresh table data
        this.resetForm();  // Reset form fields
        this.displayInsertModal = false;  // Close the dialog
      },
      error => {
        console.log("Treasury Receipt ID: " + this.selectedRow.treasuryReceiptNo);
        if (error instanceof HttpErrorResponse && error.status === 400) {
          console.error('Error updating data:', error);
          const errorMessage = error.error.message;
          this.toastService.showError(errorMessage);
        } else {
          console.error('Error updating data:', error);
          this.toastService.showError('An unexpected error occurred. Please try again.');
        }
      }
    );
  } else {
    console.log('Form is not valid. Cannot update.');
  }
}

onRowEditInit(data: ManualPpoReceiptResponseDTO) {
  this.selectedRowData = { ...data };
  this.manualPpoForm.patchValue(this.selectedRowData);
  this.displayInsertModal = true;
}



  onRowEditCancel() {
    this.selectedRowData = null;
    this.resetForm();
  }

  emitManualPpoReceiptCombination(): void {
    this.ManualPpoReceiptCombinationSelected.emit(this.manualPpoForm.value);
  }

  cancelPpoReceipt() {
    this.manualPpoForm.reset();
    this.displayInsertModal = false;
  }
}
