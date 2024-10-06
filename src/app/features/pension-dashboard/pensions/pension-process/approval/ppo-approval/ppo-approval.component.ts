import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { PensionPPODetailsService, PensionPPOStatusService, BankService, PensionerResponseDTOJsonAPIResponse, APIResponseStatus, PensionStatusFlag } from 'src/app/api';
import { ActionButtonConfig, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';
import Swal from 'sweetalert2';


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
    tableData: Array<{ response: any, branchName: string, bankName: string }> = [];
    allowApproval:boolean=true;
    returnUri: string | null = null;



    constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private pensionPPODetailsService: PensionPPODetailsService,
    private pensionPPOStatusService: PensionPPOStatusService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('ppoId') ?? '';
        this.returnUri = this.route.snapshot.queryParamMap.get('returnUri');
        this.ApprovalForm = this.fb.group({
            ppoId: [id, Validators.required]
        })
        this.idList$ = this.pensionPPODetailsService.getAllNotApprovedPensioners();
        if (this.ApprovalForm.valid) {
            this.showTable = true;
            this.loadTableData();
        }
    }

    handlePpoSearchEvent(event: any) {
        this.showTable = true;
        // console.log("",event);
        this.ApprovalForm.controls['ppoId'].setValue(event.ppoId);
        this.askApproval();
    }

    askApproval(){
        this.router.navigate(['/pension/modules/pension-process/approval/ppo-approval/', this.ApprovalForm.value['ppoId']]);
    }

    async loadTableData(): Promise<void> {
        this.isTableDataLoading = true;
        try {
            const response: PensionerResponseDTOJsonAPIResponse = await firstValueFrom(this.pensionPPODetailsService.getPensionerByPpoId(this.ApprovalForm.get('ppoId')?.value));
            if (response.apiResponseStatus === APIResponseStatus.Success && response.result) {
                this.tableData = [{
                    response: response.result,
                    branchName: response.result?.branch?.branchName ?? '',
                    bankName: response.result?.branch?.bank?.bankName ?? ''
                }];
                this.allowApproval=false;
            } else {
                this.toastService.showError('Failed to fetch initial data.');
            }
        } catch (error) {
            this.toastService.showError('An error occurred while fetching initial data.');
        } finally {
            this.isTableDataLoading = false;
            // console.log("Table Data: ", this.tableData);
        }
    }

    onRefresh(): void {
        this.ApprovalForm.reset();
    }

    onDialogClose(){
        this.router.navigate(['/pension/modules/pension-process/approval/ppo-approval']);
    }

    async approve(askApproval: boolean): Promise<void> {
        if (askApproval) {
            return;
        }
        const ppoId = this.ApprovalForm.value.ppoId;
        const statusFlag = PensionStatusFlag.PpoApproved;
        const payload = {
            statusFlag: statusFlag,
            statusWef: "2024-08-01",
            ppoId: ppoId
        }
        if (ppoId) {
            try {
                const response = await firstValueFrom(
                    this.pensionPPOStatusService.setPpoStatusFlag(payload)
                );
                this.toastService.showSuccess(response.message ?? '');
                this.showTable = false;

                if (this.returnUri) {
                    const result = await Swal.fire({
                        title: 'PPO approved. Do you want to go back to the previous form?',
                        icon: 'success',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    });

                    if (result.isConfirmed) {
                        this.router.navigate([this.returnUri]);
                        return; // Exit the method early if navigating back
                    }
                }
            } catch (error) {
                console.error('Approval failed', error);
                this.toastService.showError('Approval failed');
            }
            this.ApprovalForm.reset();
        }
        
        // If not returning to the previous form, navigate to the default route
        this.router.navigate(['/pension/modules/pension-process/approval/ppo-approval']);
    }


}
