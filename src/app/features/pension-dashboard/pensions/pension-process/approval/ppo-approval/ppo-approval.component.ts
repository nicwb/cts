import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { PensionPPODetailsService, PensionPPOStatusService, BankService, PensionerResponseDTOJsonAPIResponse } from 'src/app/api';
import { PensionStatusFlag } from 'src/app/shared/modules/pensioner-status/enumsStatus';
import { ActionButtonConfig, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ppo-approval',
  templateUrl: './ppo-approval.component.html',
  styleUrls: ['./ppo-approval.component.scss']
})
export class PpoApprovalComponent implements OnInit {
  ApprovalForm: FormGroup = new FormGroup({});
  idList$?:Observable<any>;
  tableQueryParameters: DynamicTableQueryParameters = { pageSize: 10, pageIndex: 0, filterParameters: [], sortParameters: { field: '', order: '' } };
  tableActionButton: ActionButtonConfig[] = [];
  isTableDataLoading = false;
  selectedRow: any;
  showTable = false;
  tableData: Array<{ response: any, branchName: string }> = [];



  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private pensionPPODetailsService: PensionPPODetailsService,
    private pensionPPOStatusService: PensionPPOStatusService,
    private bankService: BankService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ApprovalForm = this.fb.group({
      ppoId: ['', Validators.required]
    })

    let payload = {
      pageSize: 10,
      pageIndex: 0,
      filterParameters: [],
      sortParameters: {
          field: '',
          order: '',
      },
  };

    this.idList$ = this.pensionPPODetailsService.getAllPensioners(payload);
    
  }

  navigateToBankAccountDetails(): void {
    const ppoId = this.ApprovalForm.get('ppoId')!.value;
    this.router.navigate(['/pension/modules/pension-process/ppo/entry', ppoId, 'bank-account']);
  }

  handlePpoSearchEvent(event: any) {
    this.showTable = true;
    console.log("",event);
    this.ApprovalForm.controls['ppoId'].setValue(event.ppoId);
    
    this.loadTableData();
}


async loadTableData(): Promise<void> {
  this.isTableDataLoading = true;
  try {
    const response: PensionerResponseDTOJsonAPIResponse = await firstValueFrom(this.pensionPPODetailsService.getPensionerByPpoId(this.ApprovalForm.get('ppoId')?.value));
    if (response.apiResponseStatus === 1 && response.result) {
      const ppoId = this.ApprovalForm.get('ppoId')?.value;
      const bankAccounts = response.result.bankAccounts;
      const branchCode = bankAccounts && bankAccounts[0] && bankAccounts[0].branchCode;
      if (branchCode) {
        const branchResponse = await firstValueFrom(this.bankService.getBranchByBranchCode(branchCode));
        this.tableData = [{
          response: response.result,
          branchName: branchResponse.result?.branchName ?? ''
        }];
      } else {
        console.warn('Branch code is missing, skipping branch details');
        this.tableData = [{
          response: response.result,
          branchName: ''
        }];
      }
    } else {
      this.toastService.showError('Failed to fetch initial data.');
    }
  } catch (error) {
    this.toastService.showError('An error occurred while fetching initial data.');
  } finally {
    this.isTableDataLoading = false;
    console.log("Table Data: ", this.tableData);
  }
}



 

  onRefresh(): void {
    this.ApprovalForm.reset();
  }

  async approve(): Promise<void> {
    console.log('Approve Button is clicked');
    const ppoId = this.ApprovalForm.value.ppoId;
    const statusFlag = PensionStatusFlag.PpoApproved;
    const payload ={
      statusFlag: statusFlag,
      statusWef: "2024-08-01",
      ppoId: ppoId
    }
    if (ppoId) {
      try {
        console.log("Approve PPO", payload);
        const response = await firstValueFrom(
          this.pensionPPOStatusService.setPpoStatusFlag(payload)
        );
        console.log('Approval successful', response);
        this.toastService.showSuccess('PPO Approved successfully');
      } catch (error) {
        console.error('Approval failed', error);
        this.toastService.showError('Approval failed');
      }
    }
  }


}
