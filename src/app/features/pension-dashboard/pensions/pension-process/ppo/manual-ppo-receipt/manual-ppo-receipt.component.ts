import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { PensionManualPPOReceiptService, ManualPpoReceiptEntryDTO, ManualPpoReceiptResponseDTO } from 'src/app/api';
import { ActionButtonConfig, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manual-ppo-receipt',
  templateUrl: './manual-ppo-receipt.component.html',
  styleUrls: ['./manual-ppo-receipt.component.scss']
})
export class ManualPpoReceiptComponent implements OnInit {
  displayInsertModal = false;
  manualPpoForm!: FormGroup;
  tableQueryParameters: DynamicTableQueryParameters = { pageSize: 10, pageIndex: 0, filterParameters: [], sortParameters: { field: '', order: '' } };
  tableActionButton: ActionButtonConfig[] = [];
  tableData: { headers: any, data: ManualPpoReceiptResponseDTO[], dataCount: number } | null = null;
  isTableDataLoading = false;
  selectedRow: any;

  ppoIssuedBy: SelectItem[] = [
    { label: 'AGWB', value: 'A' },
    { label: 'DPPGWG', value: 'D' },
    { label: 'Other', value: 'O' }
  ];

  type: SelectItem[] = [
    { label: 'New PPO', value: 'N' },
    { label: 'Revise PPO', value: 'R' },
    { label: 'PSA Sanction', value: 'P' },
    { label: 'Other', value: 'O' }
  ];

  // getAllManualPpoReceipt$: Observable<any>;

  constructor(
    private datePipe: DatePipe,
    private toastService: ToastService,
    private pensionManualPpoReceiptService: PensionManualPPOReceiptService,
    private fb: FormBuilder
  ) {
    this.initForm();
    // this.getAllManualPpoReceipt$ = this.pensionManualPpoReceiptService.getAllPpoReceipts(this.tableQueryParameters);
  }

  ngOnInit(): void {
    this.tableActionButton = this.createActionButtons();
    this.fetchInitialData();
  }

  initForm(): void {
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

  createActionButtons(): ActionButtonConfig[] {
    return [{
      buttonIdentifier: 'edit',
      class: 'p-button-rounded p-button-raised',
      icon: 'pi pi-pencil',
      lable: 'Edit'
    }];
  }

  async fetchInitialData(): Promise<void> {
    this.isTableDataLoading = true;
    try {
      const response = await firstValueFrom(this.pensionManualPpoReceiptService.getAllPpoReceipts(this.tableQueryParameters));
      if (response.apiResponseStatus === 1 && response.result) {
        this.tableData = {
          headers: response.result.headers,
          data: response.result.data as ManualPpoReceiptResponseDTO[],
          dataCount: response.result.dataCount as number
        };
      } else {
        this.toastService.showError('Failed to fetch initial data.');
      }
    } catch (error) {
      this.toastService.showError('An error occurred while fetching initial data.');
    } finally {
      this.isTableDataLoading = false;
    }
  }
  

  showInsertDialog(): void {
    this.displayInsertModal = true;
  }
  

  async handSearchKeyChange(event: string): Promise<void> {
    this.isTableDataLoading = true;
    try {
      if (event) {
        const response = await this.pensionManualPpoReceiptService.getPpoReceiptByTreasuryReceiptNo(event).toPromise();
        if (response && response.apiResponseStatus === 1 && response.result) {
          const updatedData: ManualPpoReceiptResponseDTO[] = [response.result].filter((item): item is ManualPpoReceiptResponseDTO => item !== undefined)
            .map((item: ManualPpoReceiptResponseDTO) => ({
              ...item,
              receiptDate: this.formatDate(item.receiptDate) ?? ''
            }));
          this.tableData = { 
            headers: this.tableData?.headers ?? [], 
            data: updatedData, 
            dataCount: updatedData.length 
          };
        } else {
          this.toastService.showError(response?.message || 'An error occurred');
        }
      } else {
        this.tableData = { headers: this.tableData?.headers ?? [], data: [], dataCount: 0 };
      }
    } catch (error) {
      this.toastService.showError('An error occurred while fetching data');
    } finally {
      this.isTableDataLoading = false;
    }
  }


  async onSubmit(): Promise<void> {
    if (this.manualPpoForm.valid) {
      const formData: ManualPpoReceiptEntryDTO = {
        ppoNo: this.manualPpoForm.get('ppoNo')?.value,
        pensionerName: this.manualPpoForm.get('pensionerName')?.value,
        dateOfCommencement: this.formatDate(this.manualPpoForm.get('dateOfCommencement')?.value) ?? '',
        mobileNumber: this.manualPpoForm.get('mobileNumber')?.value,
        receiptDate: this.formatDate(this.manualPpoForm.get('receiptDate')?.value) ?? '',
        psaCode: this.manualPpoForm.get('psaCode')?.value,
        ppoType: this.manualPpoForm.get('ppoType')?.value
      };
  
      try {
        const apiCall = this.selectedRow 
          ? this.pensionManualPpoReceiptService.updatePpoReceiptByTreasuryReceiptNo(this.selectedRow.treasuryReceiptNo, formData)
          : this.pensionManualPpoReceiptService.createPpoReceipt(formData);
  
        const response = await firstValueFrom(apiCall);
  
        if (response.apiResponseStatus === 1) {
          await this.fetchInitialData();
          this.resetAndCloseDialog();
          this.toastService.showSuccess(`PPO Receipt ${this.selectedRow ? 'updated' : 'added'} successfully`);
        } else {
          this.handleErrorResponse(response);
        }
      } catch (error) {
        this.toastService.showError('An error occurred while submitting the form.');
      }
    } else {
      this.toastService.showError('Please fill all required fields correctly.');
    }
  }
  
  handleErrorResponse(response: any): void {
    if (response.message?.includes('duplicate key value')) {
      this.manualPpoForm.get('ppoNo')?.setErrors({ 'duplicate': true });
      this.toastService.showError('This PPO number already exists. Please use a different PPO number.');
    } else {
      this.toastService.showError(response.message || 'An unexpected error occurred.');
    }
  }
  
  formatDate(date: any): string | null {
    return date ? this.datePipe.transform(date, 'yyyy-MM-dd') : null;
  }
  
  resetAndCloseDialog(): void {
    this.manualPpoForm.reset();
    this.displayInsertModal = false;
    this.selectedRow = null;
  }
  
  convertToDate(dateOnly: any): Date | null {
    if (!dateOnly) return null;
    if (dateOnly instanceof Date) return dateOnly;
    const parsedDate = new Date(dateOnly);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  
  handleActionButtonClicked(event: any) {
    if (event.buttonIdentifier === 'edit') {
      this.editInit(event.rowData);
    }
  }

  handQueryParameterChange(event: DynamicTableQueryParameters): void {
    this.tableQueryParameters = event;
    this.fetchInitialData();
  }
  
  async editInit(rowData: ManualPpoReceiptResponseDTO): Promise<void> {
    this.selectedRow = rowData;
    try {
      const response = await firstValueFrom(this.pensionManualPpoReceiptService.getPpoReceiptByTreasuryReceiptNo(rowData.treasuryReceiptNo ?? ''));
      if (response.result) {
        const ppoReceipt: ManualPpoReceiptResponseDTO = response.result;
        this.manualPpoForm.patchValue({
          ppoNo: ppoReceipt.ppoNo,
          pensionerName: ppoReceipt.pensionerName,
          dateOfCommencement: this.convertToDate(ppoReceipt.dateOfCommencement),
          mobileNumber: ppoReceipt.mobileNumber,
          receiptDate: this.convertToDate(ppoReceipt.receiptDate),
          psaCode: ppoReceipt.psaCode,
          ppoType: ppoReceipt.ppoType
        });
        this.displayInsertModal = true;
      }
    } catch (error) {
      this.toastService.showError('Failed to fetch PPO receipt details.');
    }
  }
}