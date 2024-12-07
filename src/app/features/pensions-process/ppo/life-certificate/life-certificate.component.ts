import { Component, OnInit } from '@angular/core';
import { APIResponseStatus, BankResponseDTO, LifeCertificateEntryDTO, LifeCertificateListResponseDTOJsonAPIResponse, LifeCertificateResponseDTOJsonAPIResponse, PensionBankBranchService, PensionLifeCertificateService } from 'src/app/api';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-life-certificate',
    templateUrl: './life-certificate.component.html',
    styleUrls: ['./life-certificate.component.scss']
})
export class LifeCertificateComponent implements OnInit {
    bankName: { label: string; value: number }[] = [];
    branchName: { label: string; value: number }[] = [];
    selectedBranchId: number | null = null;
    pensionerData: any[] = [];
    selectedPpoType: string = '';
    filteredPensionerData: any[] = [];
    isReadonly: boolean = true;
    isTable: boolean = true;
    isSearch: boolean = true;
    selectedBankId: number | null = null;
    currentYear: number = new Date().getFullYear();
    isSavingAll: boolean = false;
    saveProgress: number = 0;
    private _oldData: any[] = [];
    isDialogVisible: boolean = false;
    constructor(
        private bankService: PensionBankBranchService,
        private certificate: PensionLifeCertificateService,
        private ToastService: ToastService,
        private cdr: ChangeDetectorRef
    ) {

    }
    ngOnInit(): void {
        this.fetchAllBank();
    }
    async fetchAllBank() {
        const bank = await firstValueFrom(this.bankService.getBanks());
        const banks = bank.result?.banks ?? [];
        this.bankName = banks.map((item) => ({
            label: item.bankName ?? '',
            value: item.id ?? 0
        }));
    }

    async fetchBranchName(data: number) {
        try {
            if (data) {
                const bankBranch = await firstValueFrom(this.bankService.getBranchesByBankId(data));
                const bankBranchName = bankBranch.result?.branches ?? [];
                this.branchName = bankBranchName.map((item) => ({
                    label: item.branchName ?? '',
                    value: item.id ?? 0
                }));
            }
        } catch {
            this.ToastService.showError("Something went wrong");
        }
    }
    async getNewPpo() {
        if (!this.selectedBranchId) {
            this.ToastService.showError('Branch must be selected.');
            return;
        }
        if (!this.selectedPpoType) {
            this.ToastService.showError('PPO Type must be selected.');
            return;
        }

        try {
            const data: LifeCertificateListResponseDTOJsonAPIResponse = await firstValueFrom(
                this.certificate.getLifeCertificatesByBranchId(this.selectedBranchId)
            );
            if (data.apiResponseStatus === APIResponseStatus.Success) {
                this.pensionerData = (data.result?.lifeCertificates ?? []).map((item) => {
                    if (item.id === 0) {
                        item.certificateSubmitted = null as unknown as boolean | undefined;
                    }
                    return item;
                });
                this.isTable = false;
                this.isReadonly = false;
                this.isSearch = false;
                await this.filterPensionerData();
            } else {
                this.ToastService.showError('' + data.message);
            }
        } catch (error) {
            this.ToastService.showError('An unexpected error occurred while fetching data.');
        }
    }
    filterPensionerData() {
        if (this.selectedPpoType === 'NewPPO') {
            this.filteredPensionerData = this.pensionerData.filter((item) => item.id === 0);
            this._oldData = JSON.parse(JSON.stringify(this.pensionerData.filter((item) => item.id === 0)));
            Object.freeze(this._oldData);

        } else if (this.selectedPpoType === 'UpdatedPPO') {
            this.filteredPensionerData = this.pensionerData.filter((item) => item.id !== 0);
            this._oldData = JSON.parse(JSON.stringify(this.pensionerData.filter((item) => item.id !== 0)));
            Object.freeze(this._oldData); // Make sure _oldData is frozen
        }
    }

    isSaveEnabled(rowData: any): boolean {
        if (!rowData || !rowData.ppoId) return false;
        const previousRecord = this._oldData.find((item) => item.ppoId === rowData.ppoId);
        if (previousRecord) {
            return previousRecord.certificateSubmitted !== rowData.certificateSubmitted;
        }
        return true;
    }

    async saveRow(data: any): Promise<void> {
        if (!data || !data.ppoId) {
            this.ToastService.showError('Invalid data: PPO ID is missing.');
            return;
        }
        if (data.certificateSubmitted === null) {
            this.ToastService.showError('Please select life certificate submitted or not ');
            return;
        }
        try {
            const payload: LifeCertificateEntryDTO = {
                financialYear: this.currentYear,
                ppoId: data.ppoId,
                certificateSubmitted: data.certificateSubmitted ?? false // Default to `false` if not provided
            };
            const result: LifeCertificateResponseDTOJsonAPIResponse = await firstValueFrom(this.certificate.submitLifeCertificate(payload));
            if (result.apiResponseStatus === APIResponseStatus.Success) {
                this.ToastService.showSuccess(result.message || 'Life certificate submitted successfully.');
                this.getNewPpo();
            } else if (result.apiResponseStatus === APIResponseStatus.Warning) {
                this.ToastService.showWarning(result.message || 'Submission partially successful. Please review.');
            } else {
                this.ToastService.showError(result.message || 'Failed to submit the life certificate.');
            }
        } catch (error) {
            this.ToastService.showError('An unexpected error occurred. Please try again later.');
        }
    }
    async updateRow(data: any): Promise<void> {
        if (!data || !data.ppoId) {
            this.ToastService.showError('Invalid data: PPO ID is missing.');
            return;
        }
        try {
            const payload: LifeCertificateEntryDTO = {
                financialYear: this.currentYear,
                ppoId: data.ppoId,
                certificateSubmitted: data.certificateSubmitted ?? false,
            };
            const result: LifeCertificateResponseDTOJsonAPIResponse = await firstValueFrom(
                this.certificate.updateLifeCertificateByPpoId(data.ppoId, payload)
            );
            if (result.apiResponseStatus === APIResponseStatus.Success) {
                this.ToastService.showSuccess(result.message || 'Life certificate updated successfully.');
                this.getNewPpo();
            } else if (result.apiResponseStatus === APIResponseStatus.Warning) {
                this.ToastService.showWarning(result.message || 'Update partially successful. Please review.');
            } else {
                this.ToastService.showError(result.message || 'Failed to update the life certificate.');
            }
        } catch (error) {
            this.ToastService.showError('An unexpected error occurred. Please try again later.');
        }
    }
    get hasUnsavedChanges(): boolean {
        return this.filteredPensionerData.some((row, index) => {
            if (!this._oldData[index]) return false;
            return row.certificateSubmitted !== this._oldData[index].certificateSubmitted;
        });
    }
    async saveAllRows(): Promise<void> {
        if (!this.hasUnsavedChanges) {
            this.ToastService.showError('No changes to save.');
            return;
        }

        this.isSavingAll = true; // Disable UI interactions during the operation
        this.saveProgress = 0;  // Initialize progress
        this.isDialogVisible = true;

        // Filter rows with changes
        const rowsToSave = this.filteredPensionerData.filter(
            (row, index) => row.certificateSubmitted !== this._oldData[index]?.certificateSubmitted
        );
        const totalRowsToSave = rowsToSave.length; // Total rows to save
        let totalRowsSaved = 0; // Track successfully saved rows

        for (const [index, row] of this.filteredPensionerData.entries()) {
            try {
                // Skip rows with no changes
                if (row.certificateSubmitted === this._oldData[index]?.certificateSubmitted) {
                    row.saveStatus = 'skipped';
                    continue;
                }
                const payload: LifeCertificateEntryDTO = {
                    financialYear: this.currentYear,
                    ppoId: row.ppoId,
                    certificateSubmitted: row.certificateSubmitted ?? false,
                };

                const result: LifeCertificateResponseDTOJsonAPIResponse = await firstValueFrom(
                    this.certificate.submitLifeCertificate(payload)
                );

                if (result.apiResponseStatus === APIResponseStatus.Success) {
                    row.saveStatus = 'success';
                    totalRowsSaved++;
                } else {
                    row.saveStatus = 'failure';
                }
            } catch (error) {
                row.saveStatus = 'failure';
                this.ToastService.showError(`An unexpected error occurred for row ${index + 1}.`);
            }
            this.saveProgress = Math.round((totalRowsSaved / totalRowsToSave) * 100);
        }

        this.isSavingAll = false;

        // Display final message
        if (totalRowsSaved === totalRowsToSave) {
            this.ToastService.showSuccess('All changes saved successfully.');
        } else {
            this.ToastService.showWarning(
                `${totalRowsSaved} out of ${totalRowsToSave} changes saved successfully.`
            );
        }
    }
    async updateAllRows(): Promise<void> {
        this.isSavingAll = true; // Disable UI interactions during the operation
        this.saveProgress = 0;  // Initialize progress
        this.isDialogVisible = true;
        let totalRowsSaved = 0; // Track successfully saved rows
        const rowsToSave = this.filteredPensionerData.filter(
            (row, index) => row.certificateSubmitted !== this._oldData[index]?.certificateSubmitted
        );

        const totalRowsToSave = rowsToSave.length;

        for (const [index, row] of this.changedRows.entries()) {
            try {
                if (!row.ppoId || row.certificateSubmitted === null) {
                    row.saveStatus = 'skipped';
                    this.ToastService.showWarning(`Row ${index + 1} skipped: Missing PPO ID or Certificate Submitted.`);
                    continue;
                }
                const payload: LifeCertificateEntryDTO = {
                    financialYear: this.currentYear,
                    ppoId: row.ppoId,
                    certificateSubmitted: row.certificateSubmitted ?? false,
                };
                const result: LifeCertificateResponseDTOJsonAPIResponse = await firstValueFrom(
                    this.certificate.updateLifeCertificateByPpoId(row.ppoId, payload)
                );
                if (result.apiResponseStatus === APIResponseStatus.Success) {
                    row.saveStatus = 'success';
                    totalRowsSaved++;
                } else {
                    row.saveStatus = 'failure';
                    this.ToastService.showError(`Row ${index + 1} failed: ${result.message}`);
                }
            } catch (error) {
                row.saveStatus = 'failure';
                this.ToastService.showError(`An unexpected error occurred for row ${index + 1}.`);
            }
            this.saveProgress = Math.round((totalRowsSaved / totalRowsToSave) * 100);
            this.cdr.detectChanges();
        }
        this.isSavingAll = false;

        if (totalRowsSaved === totalRowsToSave) {
            this.ToastService.showSuccess('All changes saved successfully.');
        } else {
            this.ToastService.showWarning(
                `${totalRowsSaved} out of ${totalRowsToSave} changes saved successfully.`
            );
        }
    }

    get hasChanges(): boolean {
        return this.changedRows.length > 0;
    }

    get changedRows() {
        return this.filteredPensionerData.filter((row, index) => {
            if (!this._oldData[index]) {
                return false; // Handle cases where _oldData doesn't exist for the index
            }
            return row.certificateSubmitted !== this._oldData[index].certificateSubmitted;
        });
    }

    reset() {
        this.isTable = true;
        this.isReadonly = true;
        this.isSearch = true;
        this.selectedPpoType = '';
    }

    cancle(){
        this.isDialogVisible = false;
        this._oldData = [];
        this.cdr.detectChanges();
    }

    refrish() {
        this.filteredPensionerData = JSON.parse(JSON.stringify(this._oldData)); // Create a fresh copy to avoid mutation
        this.cdr.detectChanges(); // Ensure UI updates
    }
}
