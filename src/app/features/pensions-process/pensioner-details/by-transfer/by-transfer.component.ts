import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { empty, firstValueFrom, Observable } from 'rxjs';
import {
    PensionerListItemDTOTableResponseDTOJsonAPIResponse,
    PensionFirstBillService,
    PensionPPODetailsService,
    PpoComponentRevisionPpoListItemDTOTableResponseDTOJsonAPIResponse,
    PensionComponentRevisionService,
    ByTransferHeadResponseDTOTableResponseDTOJsonAPIResponse,
    PensionByTransferService,
    PensionPpoByTransferService,
    PpoByTransferEntryDTO,
    PpoByTransferHeadResponseDTOJsonAPIResponse,
    APIResponseStatus,
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-by-transfer',
    templateUrl: './by-transfer.component.html',
    styleUrls: ['./by-transfer.component.scss'],
})
export class ByTransferComponent implements OnInit {
    byTransferForm: FormGroup = new FormGroup({}); // Declare pensionForm
    isInsertModalVisible: boolean = false;
    dialogHeader: string = 'Details';
    saveProgress: number = 0;
    isProgressVisible: boolean = false;
    ppoList$: Observable<PpoComponentRevisionPpoListItemDTOTableResponseDTOJsonAPIResponse>;
    BTnoList$: Observable<ByTransferHeadResponseDTOTableResponseDTOJsonAPIResponse>;

    formSubmitted = false;
    today: Date = new Date();
    constructor(
        private fb: FormBuilder,
        private service: PensionFirstBillService,

        private PensionByTransferService: PensionByTransferService,

        private ToastService: ToastService,

        private revisionOfComponentsService: PensionComponentRevisionService,

        private PensionPpoByTransferService: PensionPpoByTransferService
    ) {
        this.ppoList$ =
            this.revisionOfComponentsService.getAllPposForComponentRevisions();

        this.BTnoList$ = this.PensionByTransferService.getAllByTransferHeads();
    }

    ngOnInit(): void {
        this.byTransferForm = this.fb.group({
            ppoId: ['', Validators.required],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            btHead: ['', Validators.required],
            btHeadId: [''], // by transfer head id
            btNo: ['', Validators.required],
            amount: ['', Validators.required],
            remarks: [''],
        });
    }

    emptyPpoData: Array<{
        ppoId: number;
        fromDate: string | null;
        toDate: string | null;
        btNo: number;
        btHead: string;
        btHeadId: number;
        amount: number;
        remarks: string;
    }> = [];

    // method for open popup
    openpopup() {
        this.isInsertModalVisible = true;
    }

    // method for cancle popup
    cancle() {
        this.isInsertModalVisible = false;
        this.byTransferForm.reset();
    }
    deleteRow(rowIndex: number): void {
        // Remove the row from the array using the index
        this.emptyPpoData.splice(rowIndex, 1);
    }

    // method for insert data
    insertData() {
        if (this.byTransferForm.invalid) {
            this.byTransferForm.markAllAsTouched(); // Mark all fields as touched to trigger validation messages
            return; // Stop execution if form is invalid
        }

        if (this.byTransferForm.valid) {
            const formData = this.byTransferForm.value;
            // Format the data
            const formattedData = {
                ppoId: formData.ppoId || '',
                fromDate: formData.fromDate || null,
                toDate: formData.toDate || null,
                btNo: formData.btNo || '',
                btHead: formData.btHead || '',
                btHeadId: formData.btHeadId || '',
                amount: formData.amount || '',
                remarks: formData.remarks || '',
            };

            // Push the formatted data into the array
            this.emptyPpoData.push(formattedData);
            this.byTransferForm.reset();
        }
    }

    // SaveAllBytransfer(){
    //     if (this.emptyPpoData){
    //         let PpoBytransfer: PpoByTransferEntryDTO = {};
    //         PpoBytransfer.pensionerId = this.emptyPpoData[0].ppoId;
    //         PpoBytransfer.ppoId = this.emptyPpoData[0].ppoId;
    //         PpoBytransfer.fromDate = this.emptyPpoData[0]?.fromDate
    //         ? new Date(this.emptyPpoData[0].fromDate).toISOString().split('T')[0]
    //         : undefined;
    //         PpoBytransfer.toDate = this.emptyPpoData[0]?.toDate
    //         ? new Date(this.emptyPpoData[0].toDate).toISOString().split('T')[0]
    //         : undefined;
    //         PpoBytransfer.bytransferHeadId = this.emptyPpoData[0].btHeadId;
    //         PpoBytransfer.bytransferAmount = this.emptyPpoData[0].amount;
    //         PpoBytransfer.remarks = this.emptyPpoData[0].remarks;
    //         this.PensionPpoByTransferService.createPPoByTransferHeadMap(PpoBytransfer).subscribe((response) => {
    //             console.log(response);
    //         });
    //         console.log(PpoBytransfer);
    //     }

    // }

    async SaveAllBytransfer() {
        if (this.emptyPpoData.length > 0) {
            this.isProgressVisible = true; // Show progress bar
            let completed = 0;
            let failed = 0;
            const totalRequests = this.emptyPpoData.length; // Total API calls

            for (let i = 0; i < this.emptyPpoData.length; i++) {
                const item = this.emptyPpoData[i];

                let PpoBytransfer: PpoByTransferEntryDTO = {};
                (PpoBytransfer.pensionerId = item.ppoId),
                    (PpoBytransfer.ppoId = item.ppoId),
                    (PpoBytransfer.fromDate = item.fromDate
                        ? new Date(item.fromDate).toISOString().split('T')[0]
                        : undefined),
                    (PpoBytransfer.toDate = item.toDate
                        ? new Date(item.toDate).toISOString().split('T')[0]
                        : undefined),
                    (PpoBytransfer.bytransferHeadId = item.btHeadId),
                    (PpoBytransfer.bytransferAmount = item.amount),
                    (PpoBytransfer.remarks = item.remarks);
                try {
                    const result: PpoByTransferHeadResponseDTOJsonAPIResponse =
                        await firstValueFrom(
                            this.PensionPpoByTransferService.createPPoByTransferHeadMap(
                                PpoBytransfer
                            )
                        );

                    if (
                        result.apiResponseStatus === APIResponseStatus.Success
                    ) {
                        completed++;
                        this.emptyPpoData.splice(i, 1); // Remove item on success
                        i--; // Adjust index after deletion to avoid skipping the next item
                    } else {
                        failed++;
                    }
                } catch (error) {
                    failed++;
                    this.ToastService.showError('API Error:');
                }

                // Update progress bar
                this.saveProgress = (completed / totalRequests) * 100;
            }

            if (completed === totalRequests) {
                this.ToastService.showSuccess('All records saved successfully');
            } else {
                this.ToastService.showError(
                    `Completed: ${completed}, Failed: ${failed}`
                );
            }
        }
    }

    handleSelectedRow(event: any) {
        this.byTransferForm.patchValue({
            ppoId: event.ppoId,
        });
    }

    BTnoListSelectedRow(event: any) {
        this.byTransferForm.patchValue({
            btNo: event.accountHeadId,
            btHeadId: event.id,
            btHead: event.byTransferDescription,
        });
    }
}
