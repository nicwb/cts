import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { empty, Observable } from 'rxjs';
import { PensionerListItemDTOTableResponseDTOJsonAPIResponse, PensionFirstBillService, PensionPPODetailsService, PpoComponentRevisionPpoListItemDTOTableResponseDTOJsonAPIResponse, PensionComponentRevisionService, ByTransferHeadResponseDTOTableResponseDTOJsonAPIResponse, PensionByTransferService, PensionPpoByTransferService, PpoByTransferEntryDTO } from 'src/app/api';

@Component({
    selector: 'app-by-transfer',
    templateUrl: './by-transfer.component.html',
    styleUrls: ['./by-transfer.component.scss'],
})
export class ByTransferComponent implements OnInit {
    byTransferForm: FormGroup = new FormGroup({}); // Declare pensionForm

    isInsertModalVisible: boolean = false;
    dialogHeader: string = 'Details';

    ppoList$: Observable<PpoComponentRevisionPpoListItemDTOTableResponseDTOJsonAPIResponse>;

    BTnoList$: Observable<ByTransferHeadResponseDTOTableResponseDTOJsonAPIResponse>;

    constructor(
        private fb: FormBuilder,
        private service: PensionFirstBillService,

        private PensionByTransferService: PensionByTransferService,

        private revisionOfComponentsService: PensionComponentRevisionService,

        private PensionPpoByTransferService: PensionPpoByTransferService
    ) {
        this.ppoList$ = this.revisionOfComponentsService.getAllPposForComponentRevisions();
        this.BTnoList$ = this.PensionByTransferService.getAllByTransferHeads();
    }

    ngOnInit(): void {
        this.byTransferForm = this.fb.group({
            ppoId: [''],
            fromDate: [''],
            toDate: [''],
            btNo: [''],
            btHead: [''],
            amount: [''],
            remarks: [''],
        });
    }

    emptyPpoData: Array<{
        ppoId: string;
        fromDate: Date | null;
        toDate: Date | null;
        btNo: string;
        btHead: string;
        amount: string;
        remarks: string;
    }> = [];

    // method for open popup
    openpopup() {
        this.isInsertModalVisible = true;
    }

    // method for cancle popup

    cancle() {
        this.isInsertModalVisible = false;
    }
    deleteRow(rowIndex: number): void {
        // Remove the row from the array using the index
        this.emptyPpoData.splice(rowIndex, 1);
    }

    // method for insert data
    insertData() {
        if (this.byTransferForm.valid) {
            const formData = this.byTransferForm.value;
            // Format the data
            const formattedData = {
                ppoId: formData.ppoId || '',
                fromDate: formData.fromDate || null,
                toDate: formData.toDate || null,
                btNo: formData.btNo || '',
                btHead: formData.btHead || '',
                amount: formData.amount || '',
                remarks: formData.remarks || '',
            };

            // Push the formatted data into the array
            this.emptyPpoData.push(formattedData);
            this.byTransferForm.reset();
        }
    }

    SaveAllBytransfer(){
        if (this.emptyPpoData){
            let PpoBytransfer: PpoByTransferEntryDTO = {};
            // PpoBytransfer.ppoId = this.emptyPpoData[0].ppoId;

        }


    }

    handleSelectedRow(event: any) {

        this.byTransferForm.patchValue({
            ppoId: event.ppoId,
            });
            console.log(event.ppoId);
    }

    BTnoListSelectedRow(event: any) {
        console.log(event);
    };
}
