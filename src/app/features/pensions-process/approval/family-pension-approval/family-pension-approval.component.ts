import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import {
    APIResponseStatus,
    PensionerListItemDTOTableResponseDTOJsonAPIResponse,
    PensionPPODetailsService,
} from 'src/app/api';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-family-pension-approval',
    templateUrl: './family-pension-approval.component.html',
    styleUrls: ['./family-pension-approval.component.scss'],
})
export class FamilyPensionApprovalComponent implements OnInit {
    pensionForm: FormGroup = new FormGroup({});
    getpensionbill: any;
    ppoList$?: Observable<PensionerListItemDTOTableResponseDTOJsonAPIResponse>;

    constructor(
        private fb: FormBuilder,
        private ppoListService: PensionPPODetailsService
    ) {}
    ngOnInit(): void {
        this.initializer();

        this.ppoList$ = this.ppoListService.getPensioners();
    }
    initializer() {
        this.pensionForm = this.fb.group({
            ppoId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            ppoNo: ['', Validators.required],
            enhancedFamilyPension: ['', Validators.required],
            efpUptoDate: ['', Validators.required],
            familyPension: ['', Validators.required],
        });
    }

    handleSelectedRow(event: any) {
        this.pensionForm.patchValue({
            ppoId: event.ppoId,
            ppoNo: event.ppoNo,
        });
    }

    async approve(): Promise<void> {
        console.log('Approve Button is clicked');
    }
    refreshTable() {
        this.getpensionbill = null;
        this.pensionForm.reset();
    }

    save() {
        console.log('Save button is clicked');
    }

    search() {
        console.log('Search button is clicked');
    }
}
