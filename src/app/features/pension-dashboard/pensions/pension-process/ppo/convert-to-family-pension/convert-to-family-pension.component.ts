import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Customer } from 'src/app/demo/api/customer';
import { Product } from 'src/app/demo/api/product';
import { CountryService } from 'src/app/demo/service/country.service';
import { Intr1, Intr2, Intr3,Intr4 } from './../../../../../../core/models/convert-to-family-pension';
interface expandedRows {
  [key: string]: boolean;
}
@Component({
    selector: 'app-convert-to-family-pension',
    templateUrl: './convert-to-family-pension.component.html',
    styleUrls: ['./convert-to-family-pension.component.scss']
})
export class ConvertToFamilyPensionComponent implements OnInit {

    myForm: FormGroup;
    myForm2: FormGroup;
  
    selectedDrop: SelectItem = { value: '' };
    countries: any[] | undefined;
    status: SelectItem[] = [];
    susselectedDrop: SelectItem = { value: '' };
    susType: SelectItem[] = [];
    relationship: SelectItem = { value: '' };
    relatype: SelectItem[] = [];
    relationship1: SelectItem = { value: '' };
    relatype1: SelectItem[] = [];
    Nominee_type: SelectItem = { value: ''};
    type: SelectItem[] = [];
    SelectItem = { value: '' };

    rowGroupMetadata: any;
    expandedRows: expandedRows = {};
    isExpanded: boolean = false;
    products: Product[] = [];
    valCheck: string[] = []

    customers1: Customer[] = [{
        name: 'amit'
    }];

    customers2: Intr3[];
    customers3: Intr1[];
    pension_details_items: Intr2[];
  

    constructor(private countryService: CountryService,private fb: FormBuilder) {

        this.myForm = this.fb.group({
            items: this.fb.array([])
        });
        this.customers3 = [
            { id: '' },
            { id: '' },
            { id: '' },
            { id: '' }
        ];
        this.pension_details_items = [
            { Component_description: 'Shruti', wef: '12/01/2015', amount: 10000 },
            { Component_description: 'Sumit', wef: '12/07/2015', amount: 20000 },
            { Component_description: 'Ayansh', wef: '14/06/2018', amount: 15000 },
            { Component_description: 'Sangita', wef: '05/06/2014', amount: 5000 }
        ];
        this.customers2=[
            {id: ''}
        ]
    
        this.myForm2 =   this.fb.group({
            ppo_id: [''],
            ppo_number: [''],
            pension_name: [''],
            commmencement_date: [''],
            basic_pension: [''],
            bank_name: [''],
            commuted_amount: [''],
            bank_account_no: [''],
            pension_reduced: [''],
            date_of_death: [''],
            pension_status: [''],
            expire_date: [''],
            pension_type: [''],
            category_description: [''],
            remarks: ['']
        });
    }

    get items() {
        return this.myForm.get('items') as FormArray;
    }

    addItem() {
        this.items.push(this.fb.group({
            Dependent_name: [''],
            Relationship: [''],
            date_of_birth: [''],
            Handicap: [''],
            Eligible_for_family_pension: ['']
        }));
    }

    ngOnInit() {
        this.countryService.getCountries().then(countries => {
            return this.countries = countries;
        })
        this.susType = [
            { label: 'Pension', value: { id: 1, name: 'Pension', code: 'Pension' } },
            { label: 'Terminated', value: { id: 2, name: 'Terminated', code: 'terminated' } },
        ];

    }
    onSort() {
        this.rowGroupMetadata();
    }


    expandAll() {
        this.products.forEach(product => product && product.name ? this.expandedRows[product.name] = true : '');
    }
    onSubmit() {
        console.log(this.myForm2);
    }
}
