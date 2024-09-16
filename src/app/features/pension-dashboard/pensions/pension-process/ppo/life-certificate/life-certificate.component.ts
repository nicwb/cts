import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormGroup,FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
@Component({
    selector: 'app-life-certificate',
    templateUrl: './life-certificate.component.html',
    styleUrls: ['./life-certificate.component.scss']
})
export class LifeCertificateComponent implements OnInit {
    dateValue: Date | undefined;
    Fpn:number = 0;
    //added
  
    //For form
    lifeCertificateForm = new FormGroup({
    // added
        financialYear:  new FormControl(''),
        newPPO: new FormControl('',Validators.required),
        branchName: new FormControl('', Validators.required),
        pensionerStatus: new FormControl('', Validators.required),
    });


    selectedDrop: SelectItem = { value: '' };
    years: { label: number, value: number }[] = [];
    constructor() {

    }

    ngOnInit(): void {
        this.generateYearRange(2000, 2024);
    }

    generateYearRange(startYear: number, endYear: number): void {
        for (let year = startYear; year <= endYear; year++) {
            this.years.push({ label: year, value: year });
        }
    }

    onRefresh(){
        console.log(this.lifeCertificateForm.value);
    }

    searchOne(){
        console.log("Search One");
    }

    searchTwo(){
        console.log("Search Two");
    }

}
