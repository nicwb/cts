import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PensionComponentRevisionService } from 'src/app/api';

@Component({
    selector: 'app-revisionof-components',
    templateUrl: './revisionof-components.component.html',
    styleUrls: ['./revisionof-components.component.scss'],
})
export class RevisionofComponentsComponent implements OnInit {
    revisionOfComponentsForm: FormGroup = new FormGroup({});
    allPensionPPOIds$?: Observable<any>;
    showTable: boolean = false;
    paymentOptions:any[] = [];
    products: any[] = [];
    cols: { field: string; header: string; }[] = [];
    constructor(
        private fb: FormBuilder,
        private revisionOfComponentsService: PensionComponentRevisionService // injecting service here
    ) {
        this.initializeForm(); // initializing form on component load
    }

    // formBuilder create
    initializeForm() {
        this.revisionOfComponentsForm = this.fb.group({
            ppoId: [''],
            slNo: [''],
            ppoNumber: [''],
            pensionerName: [''],
            categoryDescription: [''],
            bank: [''],
            radioButton: [true],
        });
    }

    ngOnInit(): void {
        console.log('');
        this.paymentOptions = [
            { name: 'Current', value: 2 },
            { name: 'All', value: 1 },
        ];
        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];
    }

    handleSelectedRowByPensionPPDetails($event:any){
        console.log($event)
    }
    
    onSubmit(){
        console.log("Submit")
    }

    tableDisable(){
        this.showTable = false;
    }

}
