import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { PensionManualPPOReceiptService, ManualPpoReceiptEntryDTO, ManualPpoReceiptResponseDTO, PensionFactoryService, APIResponseStatus } from 'src/app/api';
import { ActionButtonConfig, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { SelectItem } from 'primeng/api';
import { DatePipe, Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';


@Component({
    selector: 'app-manual-ppo-receipt',
    templateUrl: './ppo-receipt.component.html',
    styleUrls: ['./ppo-receipt.component.scss']
})
export class PpoReceiptComponent implements OnInit {
    returnUri: string | null = null;
    isInsertModalVisible = false;
    manualPpoForm!: FormGroup;
    tableQueryParameters: DynamicTableQueryParameters = { pageSize: 10, pageIndex: 0, filterParameters: [], sortParameters: { field: '', order: '' } };
    actionButtons: ActionButtonConfig[] = [];
    tableData: { headers: any, data: ManualPpoReceiptResponseDTO[], dataCount: number } | null = null;
    isDataLoading = false;
    selectedRow: any;
  @Input () receiptId?: number;
  isFetchUserInfo = false;
  isTableVisible = false;
  maxDate = new Date();

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


  constructor(
    private datePipe: DatePipe,
    private toastService: ToastService,
    private pensionManualPpoReceiptService: PensionManualPPOReceiptService,
    private pensionFactoryService: PensionFactoryService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private navc: NavigationService,
    private location: Location
  ) {
      this.initializePpoReceiptForm();
  }

  ngOnInit(): void {
      // endpint
      const endpoint = this.route.snapshot.url.map(segment => segment.path).join('/');
      if(endpoint == 'receipt/new'){
          this.openNewPpoReceiptForm();
      }
      this.actionButtons = this.getActionButtonConfig();
      //   this.loadInitialTableData();
      this.route.queryParamMap.subscribe(params => {
          this.returnUri = params.get('returnUri');
      });
      // Check if receiptId is provided via route parameters
      this.route.paramMap.subscribe(params => {
          const routeReceiptId = params.get('receiptId');
          if (routeReceiptId) {
              this.receiptId = this.route.snapshot.params['receiptId'] as number;
              this.fetchUserInfo();
          }
      });
  }

  loadPpoReceipts(): void {
      // this.router.navigate(['/pension/modules/pension-process/ppo/manualPpoReceipt/new']);
      this.isTableVisible = true;
      this.loadInitialTableData(); 
  }

  initializePpoReceiptForm(): void {
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

  async fetchUserInfo(): Promise<void> {
      if (this.receiptId) {
          try {
              const response = await firstValueFrom(this.pensionManualPpoReceiptService.getPpoReceiptById(this.receiptId));
              if (response.result) {
                  const ppoReceipt: ManualPpoReceiptResponseDTO = response.result;
                  this.manualPpoForm.patchValue({
                      ppoNo: ppoReceipt.ppoNo,
                      pensionerName: ppoReceipt.pensionerName,
                      dateOfCommencement: this.parseToDate(ppoReceipt.dateOfCommencement),
                      mobileNumber: ppoReceipt.mobileNumber,
                      receiptDate: this.parseToDate(ppoReceipt.receiptDate),
                      psaCode: ppoReceipt.psaCode,
                      ppoType: ppoReceipt.ppoType
                  });
                  this.selectedRow = true;
                  this.manualPpoForm.enable();
                  this.isInsertModalVisible = true;
              }
          } catch (error) {
              this.toastService.showError('Failed to fetch PPO receipt details.');
          }
      }
      this.isFetchUserInfo = true;
  }

  async fetchUserInfoUpdate(): Promise<void> {
      if (this.receiptId !== undefined) {
          const formData: ManualPpoReceiptEntryDTO = {
              ppoNo: this.manualPpoForm.get('ppoNo')?.value,
              pensionerName: this.manualPpoForm.get('pensionerName')?.value,
              dateOfCommencement: this.formatDateToString(this.manualPpoForm.get('dateOfCommencement')?.value) ?? '',
              mobileNumber: this.manualPpoForm.get('mobileNumber')?.value,
              receiptDate: this.formatDateToString(this.manualPpoForm.get('receiptDate')?.value) ?? '',
              psaCode: this.manualPpoForm.get('psaCode')?.value,
              ppoType: this.manualPpoForm.get('ppoType')?.value
          };
  
          const response = await firstValueFrom(this.pensionManualPpoReceiptService.updatePpoReceipt(this.receiptId, formData));
          this.isFetchUserInfo = false;
      } else {
          console.error('receiptId is undefined');
      }
  }

  getActionButtonConfig(): ActionButtonConfig[] {
      return [{
          buttonIdentifier: 'edit',
          class: 'p-button-rounded p-button-raised',
          icon: 'pi pi-pencil',
          lable: 'Edit'
      }];
  }

  async loadInitialTableData(): Promise<void> {
      this.isDataLoading = true;
      try {
          const response = await firstValueFrom(this.pensionManualPpoReceiptService.getAllPpoReceipts(this.tableQueryParameters));
          if (response.apiResponseStatus === APIResponseStatus.Success && response.result) {
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
          this.isDataLoading = false;
      }
  }
  

  openNewPpoReceiptForm(): void {
      if(!environment.production){
          this.fillFactoryData();
      }
      this.isInsertModalVisible = true;
  }
  

  async onSearchKeyChange(event: string): Promise<void> {
      this.isDataLoading = true;
      try {
          if (event) {
              const response = await this.pensionManualPpoReceiptService.getPpoReceiptByTreasuryReceiptNo(event).toPromise();
              if (response && response.apiResponseStatus === APIResponseStatus.Success && response.result) {
                  const updatedData: ManualPpoReceiptResponseDTO[] = [response.result].filter((item): item is ManualPpoReceiptResponseDTO => item !== undefined)
                      .map((item: ManualPpoReceiptResponseDTO) => ({
                          ...item,
                          receiptDate: this.formatDateToString(item.receiptDate) ?? ''
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
          this.isDataLoading = false;
      }
  }


  async submitPpoReceipt(): Promise<void> {
      if (this.manualPpoForm.valid) {
          const formData: ManualPpoReceiptEntryDTO = {
              ppoNo: this.manualPpoForm.get('ppoNo')?.value,
              pensionerName: this.manualPpoForm.get('pensionerName')?.value,
              dateOfCommencement: this.formatDateToString(this.manualPpoForm.get('dateOfCommencement')?.value) ?? '',
              mobileNumber: this.manualPpoForm.get('mobileNumber')?.value,
              receiptDate: this.formatDateToString(this.manualPpoForm.get('receiptDate')?.value) ?? '',
              psaCode: this.manualPpoForm.get('psaCode')?.value,
              ppoType: this.manualPpoForm.get('ppoType')?.value
          };
  
          try {
              const apiCall = this.selectedRow 
                  ? this.pensionManualPpoReceiptService.updatePpoReceiptByTreasuryReceiptNo(this.selectedRow.treasuryReceiptNo, formData)
                  : this.pensionManualPpoReceiptService.createPpoReceipt(formData);

              const response = await firstValueFrom(apiCall);

              if (response.apiResponseStatus === APIResponseStatus.Success) {
                  //   await this.loadInitialTableData();
                  this.resetAndCloseDialog();
                  this.toastService.showSuccess(`PPO Receipt ${this.selectedRow ? 'updated' : 'added'} successfully`);
                
                  if (this.returnUri) {
                      await Swal.fire({
                          title: 'Manual PPO receipt is created. Do you want to go back to entry form?',
                          icon: 'question',
                          showCancelButton: true,
                          confirmButtonText: 'Yes',
                          cancelButtonText: 'No'
                      }).then((result) => {
                          if (result.isConfirmed) {
                              this.router.navigate([this.returnUri]);
                          }
                      });
                  }
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
  
  formatDateToString(date: any): string | null {
      return date ? this.datePipe.transform(date, 'yyyy-MM-dd') : null;
  }
  
  resetAndCloseDialog(): void {
      this.manualPpoForm.reset();
      this.isInsertModalVisible = false;
      this.selectedRow = null;
  }
  
  parseToDate(dateOnly: any): Date | null {
      if (!dateOnly) return null;
      if (dateOnly instanceof Date) return dateOnly;
      const parsedDate = new Date(dateOnly);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  
  onActionButtonClick(event: any) {
      if (event.buttonIdentifier === 'edit') {
          this.initializeEditForm(event.rowData);
      }
  }

  onQueryParametersChange(event: DynamicTableQueryParameters): void {
      this.tableQueryParameters = {
          pageSize: event.pageSize,
          pageIndex: event.pageIndex/10,
          filterParameters: event.filterParameters || [],
          sortParameters: event.sortParameters
      }
      this.loadInitialTableData();
  }
  
  async initializeEditForm(rowData: ManualPpoReceiptResponseDTO): Promise<void> {
      this.selectedRow = rowData;
      try {
          const response = await firstValueFrom(this.pensionManualPpoReceiptService.getPpoReceiptByTreasuryReceiptNo(rowData.treasuryReceiptNo ?? ''));
          if (response.result) {
              const ppoReceipt: ManualPpoReceiptResponseDTO = response.result;
              this.manualPpoForm.patchValue({
                  ppoNo: ppoReceipt.ppoNo,
                  pensionerName: ppoReceipt.pensionerName,
                  dateOfCommencement: this.parseToDate(ppoReceipt.dateOfCommencement),
                  mobileNumber: ppoReceipt.mobileNumber,
                  receiptDate: this.parseToDate(ppoReceipt.receiptDate),
                  psaCode: ppoReceipt.psaCode,
                  ppoType: ppoReceipt.ppoType
              });
              this.isInsertModalVisible = true;
          }
      } catch (error) {
          this.toastService.showError('Failed to fetch PPO receipt details.');
      }
  }

  async fillFactoryData(): Promise<void> {
      try {
          const response = await firstValueFrom(this.pensionFactoryService.createFake('ManualPpoReceiptEntryDTO'));
          if (response.result) {
              const ppoReceipt: ManualPpoReceiptResponseDTO = response.result;
              this.manualPpoForm.patchValue({
                  ppoNo: ppoReceipt.ppoNo,
                  pensionerName: ppoReceipt.pensionerName,
                  dateOfCommencement: this.parseToDate(ppoReceipt.dateOfCommencement),
                  mobileNumber: ppoReceipt.mobileNumber,
                  receiptDate: this.parseToDate(ppoReceipt.receiptDate),
                  psaCode: ppoReceipt.psaCode,
                  ppoType: ppoReceipt.ppoType
              });
              this.isInsertModalVisible = true;
          }
      } catch (error) {
          this.toastService.showError('Failed to fetch PPO receipt details.');
      }
  }

  createNewMnualresipt(){
      //   this.navc.navigateTo('/pension/modules/pension-process/ppo/receipt/new','/pension/modules/pension-process/ppo/manualPpoReceipt')
      this.router.navigate(['/pension/modules/pension-process/ppo/receipt/new']); 

  }
  onDialogClose(){
      this.location.back();
  }
}