import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ppid } from 'process';
import { firstValueFrom, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';  // Import debounceTime and distinctUntilChanged
import { APIResponseStatus, PensionComponentRevisionService, PensionComponentService, PensionFirstBillService, PensionPPODetailsService, PpoBillResponseDTOJsonAPIResponse, PpoComponentRevisionEntryDTO, PensionBankBranchService } from 'src/app/api';
import { DatePipe } from '@angular/common';
import { flush } from '@angular/core/testing';
import { ToastService } from 'src/app/core/services/toast.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-revisionof-components',
    templateUrl: './revisionof-components.component.html',
    styleUrls: ['./revisionof-components.component.scss'],
})
export class RevisionofComponentsComponent implements OnInit {
    revisionOfComponentsForm: FormGroup = new FormGroup({});
    pensionForm: FormGroup = new FormGroup({});  // Declare pensionForm
    tableForm: FormGroup = new FormGroup({});  // Declare pensionForm
    componentForm: FormGroup = new FormGroup({});  // Declare pensionForm
    ppoList$: Observable<any>;
    pensionComponent$: Observable<any>;
    showTable: boolean = false;
    getpensionbill!: PpoBillResponseDTOJsonAPIResponse;
    ppoId?: number;
    responce: any;
    isEditing: boolean = false;
    isSearch: boolean = false;
    editRowId: number | null = null;
    isInsertModalVisible: boolean = false;
    hasPpoDetailsFetched = false;
    rateid: any;
    isMobileView: boolean = false;
    disableButton: boolean = false;
    isPopupTableDisabled = true;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.isMobileView = window.innerWidth <= 900;
    }

    constructor(
        private fb: FormBuilder,
        private revisionOfComponentsService: PensionComponentRevisionService,
        private ppoListService: PensionPPODetailsService,
        private firstbill: PensionFirstBillService,
        private pensionComponentService: PensionComponentService,
        private datePipe: DatePipe,
        private toastService: ToastService,
        private bank: PensionBankBranchService

    ) {
        const payload = {
            listType: 'type1',
            pageSize: 200,
            pageIndex: 0,
            filterParameters: [],
        };
        this.ppoList$ = this.revisionOfComponentsService.getAllPposForComponentRevisions();

        this.pensionComponent$ = this.pensionComponentService.getAllComponents(payload);

    }

    ngOnInit(): void {
        this.pensionForm = this.fb.group({
            ppoId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]], // PPO ID must be a number
            ppono: ['',Validators.required],
            pensionerName: ['',Validators.required],
            category: ['',Validators.required],
            bankcode: ['',Validators.required]
        });
        this.componentForm = this.fb.group({
            componentname: ['', Validators.required],
            fromDate: ['', Validators.required],
            amount: ['', Validators.required]
        });
        this.tableForm = this.fb.group({
            revisions: this.fb.array([])  // Create an empty FormArray for table rows
        });
        this.pensionForm.get('ppoId')?.valueChanges.subscribe(value => {
            this.ppoId = value;
        });
        this.isMobileView = window.innerWidth <= 900; // Set on init
    }

    handleSelectedRow(event: any) {
        this.pensionForm.patchValue({
            ppoId: event.ppoId,
            bankcode: event.bankBranchName,
            ppono: event.ppoNo,
            pensionerName: event.pensionerName,
            category: event.categoryDescription,
        });

        if(this.pensionForm.valid){
            this.hasPpoDetailsFetched = true;
            this.isSearch = true;
        }
    }

    // Method to fetch PPO details when a valid PPO ID is entered


    get revisions() {
        return this.tableForm.get('revisions') as FormArray;
    }

    async SearchComponent() {
        if (this.ppoId) {
            const responce = await firstValueFrom(this.revisionOfComponentsService.getPpoComponentRevisionsByPpoId(this.ppoId));
            if (responce.apiResponseStatus === APIResponseStatus.Success) {
                this.toastService.showSuccess('' + responce.message);
                if (Array.isArray(responce.result)) {
                    this.responce = responce.result.sort((a: any, b: any) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());
                }
                this.showTable = true;
                this.isPopupTableDisabled = !this.pensionForm.valid;
                this.patchFormValues(this.responce);

            }
        }
    }

    // Method to patch form values with revisions array
    patchFormValues(revisions: any[]) {
        this.revisions.clear();
        revisions.forEach((revision, index) => {
            const parsedDate = new Date(revision.fromDate);
            this.revisions.push(this.fb.group({
                id: [revision.id],
                breakupId: [revision.rate.breakupId],
                componentName: [revision.rate.breakup.componentName],
                fromDate: [this.datePipe.transform(parsedDate, 'yyyy-MM-dd')], // Use 'yyyy-MM-dd'
                toDate: [this.getToDate(index)],
                amountPerMonth: [revision.amountPerMonth]
            }));
        });
    }


    // Enable edit for specific row by id
    enableEdit(rowId: number) {
        this.editRowId = rowId;
    }

    // Check if the row is being edited
    isRowEditing(rowId: number): boolean {
        return this.editRowId === rowId;
    }

    // Save changes and disable edit mode
    async saveRow(rowId: number) {
        const revisionForm = this.revisions.controls.find(control => control.get('id')?.value === rowId);
        if (revisionForm) {
            const payload = {
                fromDate: revisionForm.get('fromDate')?.value,
                amountPerMonth: revisionForm.get('amountPerMonth')?.value,
            };
            try {
                const response = await firstValueFrom(
                    this.revisionOfComponentsService.updatePpoComponentRevisionById(rowId, payload)
                );
                if (response.apiResponseStatus === APIResponseStatus.Success) {
                    this.toastService.showSuccess('' + response.message);
                    this.loadComponentRevisions();
                    this.editRowId = null;
                }
            } catch (error) {
                this.toastService.showError('' + APIResponseStatus.Error);
            }
        }
    }
    // Delete Component
    async delete(rowId: number) {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete this component!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await firstValueFrom(
                    this.revisionOfComponentsService.deletePpoComponentRevisionById(rowId)
                );
                if (response.apiResponseStatus === APIResponseStatus.Success) {
                    this.toastService.showSuccess('' + response.message);
                    this.loadComponentRevisions();
                } else if (response.apiResponseStatus === APIResponseStatus.Error) {
                    this.toastService.showSuccess('' + response.message);
                }
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    }
    // save Component
    async saveComponent() {
        const payload: PpoComponentRevisionEntryDTO = {
            rateId: this.rateid,
            fromDate: this.datePipe.transform(this.componentForm.get('fromDate')?.value, 'yyyy-MM-dd') || '',
            amountPerMonth: this.componentForm.get('amount')?.value
        };
        if (this.ppoId && this.componentForm.valid) {
            try {
                const response = await firstValueFrom(
                    this.revisionOfComponentsService.createSinglePpoComponentRevision(this.ppoId, payload)
                );
                if (response.apiResponseStatus === APIResponseStatus.Success) {
                    this.toastService.showSuccess('' + response.message);
                    this.componentForm.reset();
                    this.loadComponentRevisions();
                } else if (response.apiResponseStatus === APIResponseStatus.Error) {
                    this.toastService.showSuccess('' + response.message);
                }
            } catch (error) {
                this.toastService.showError('' + APIResponseStatus.Error);
            }
        }
    }
    // refresh
    refresh() {
        this.pensionForm.reset();
        this.showTable = false;
        this.isSearch = false;
        this.hasPpoDetailsFetched = false;
        this.isPopupTableDisabled = true;

    }
    // Select row


    handleSelectedRowByPensionComponent(event: any) {
        this.rateid = event.id
        this.componentForm.patchValue({
            componentname: event.componentName
        })
    }

    addcomponent() {
        this.isInsertModalVisible = true;
    }

    // Load component revision when table in modify
    loadComponentRevisions() {
        if (this.ppoId) {
            this.revisionOfComponentsService.getPpoComponentRevisionsByPpoId(this.ppoId).subscribe(
                (response) => {
                    if (response.apiResponseStatus === APIResponseStatus.Success) {
                        this.responce = response?.result?.sort((a: any, b: any) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());
                        this.patchFormValues(this.responce);
                    }
                },
                (error) => {
                    this.toastService.showError('' + APIResponseStatus.Error);
                }
            );
        }
    }
    cancelEdit(rowId: number) {
        if (this.editRowId === rowId) {
            this.editRowId = null;
        }
    }
    // Custom method to subtract one day from the next row's fromDate
    getToDate(index: number): string {
        if (this.responce[index + 1]) {
            const nextFromDate = new Date(this.responce[index + 1].fromDate);
            nextFromDate.setDate(nextFromDate.getDate() - 1);
            return nextFromDate.toISOString().split('T')[0];  // Format as YYYY-MM-DD
        } else {
            return 'N/A';  // If it's the last row
        }
    }

    resetAndCloseDialog(): void {
        this.componentForm.reset();
        this.isInsertModalVisible = false;
        // this.selectedRow = null;
    }
    // Check if any row is in editing mode
    isAnyRowEditing(): boolean {
        return this.editRowId !== null;
    }
}
