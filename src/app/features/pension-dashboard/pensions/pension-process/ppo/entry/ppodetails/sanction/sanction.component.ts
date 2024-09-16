import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';


@Component({
    selector: 'app-sanction',
    templateUrl: './sanction.component.html',
    styleUrls: ['./sanction.component.scss']
})

export class SanctionComponent implements OnInit {

    ppoSanctionForm!: FormGroup;
    genders: SelectItem[]=[];

    constructor(private fb: FormBuilder) {

    }

    ngOnInit(): void {
        this.initializer();

        this.genders = [
            { label: 'Male', value: { id: 1, name: 'Male', code: 'M' } },
            { label: 'Female', value: { id: 2, name: 'Female', code: 'F' } },
            { label: 'Transgender', value: { id: 3, name: 'Transgender', code: 'T' } },
        ];
    }

    initializer(): void {
        this.ppoSanctionForm = this.fb.group({
            PpoId: ['', Validators.required],
            nameOfServiceHolder: ['', Validators.required],
            sanctionAuthority: ['', Validators.required],
            sanctionNo: ['', Validators.required],
            sanctionDate: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            gender: ['',Validators.required],
            dateOfAppointment: ['', Validators.required],
            officeName: ['', Validators.required],
            postHeld: ['',Validators.required],
            lastPay: ['',Validators.required],
            averageAmolument:['',Validators.required],
            hrmsUniqueIdOfServiceHolder: ['',Validators.required],
            issuingAuthority: ['',Validators.required],
            letterNo: ['',Validators.required],
            letterDate: ['',Validators.required],
            grossYear: ['',Validators.required],
            grossMonth: ['',Validators.required],
            grossDay: ['',Validators.required],
            netYear: ['',Validators.required],
            netMonth: ['',Validators.required],
            netDay: ['',Validators.required],
        });
    }

    onSearch(): void {
        if (this.ppoSanctionForm.valid) {
            console.log(this.ppoSanctionForm.value); 
        }
    }
  
  
}



