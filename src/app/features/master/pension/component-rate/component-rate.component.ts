import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import {
    PensionComponentRateService,
    ComponentRateEntryDTO,
    ComponentRateResponseDTOJsonAPIResponse,
    PensionBreakupResponseDTO,
} from 'src/app/api';
import { PensionCategoryMasterService } from 'src/app/api';
import { PensionComponentService } from 'src/app/api';
import { Observable } from 'rxjs';

interface City {
    name: string;
    code: string;
}
@Component({
    selector: 'app-component-rate',
    templateUrl: './component-rate.component.html',
    styleUrls: ['./component-rate.component.scss'],
})
export class ComponentRateComponent implements OnInit {
    // added
    tabledata: any;
    isTableDataLoading = false;
    cities: any[] = [];

    allPensionCategory$?: Observable<any>;
    pensionComponent$?: Observable<any>;

    ComponentRateForm = new FormGroup({
        // rate:  new FormControl('',Validators.required),
        // pensionCategoryId: new FormControl('',Validators.required),
        // description: new FormControl('', Validators.required),

        //new added
        categoryId: new FormControl('', Validators.required),
        breakupId: new FormControl('', Validators.required),
        effectiveFromDate: new FormControl('', Validators.required),
        rateType: new FormControl('A', Validators.required),
        rateAmount: new FormControl('', Validators.required),
    });

    constructor(
      
        private service: PensionComponentRateService,
        private pensionCategoryMasterService: PensionCategoryMasterService,
        private pensionComponentService: PensionComponentService
    ) {}
    ngOnInit(): void {
        console.log('ngOnInit');
        let payload = {
            pageSize: 10,
            pageIndex: 0,
            filterParameters: [],
            sortParameters: {
                field: '',
                order: '',
            },
        };
        this.allPensionCategory$ =
            this.pensionCategoryMasterService.getAllCategories(payload);
        this.pensionComponent$ =
            this.pensionComponentService.getAllComponents(payload);
    }

    handleSelectedRowByPensionCategory(event: any) {
        console.log(event);
        // this.ComponentRateForm.controls['pensionCategoryId'].setValue(record.primaryCategoryId);
        // this.ComponentRateForm.controls['description'].setValue(record.categoryName);
        this.ComponentRateForm.controls['categoryId'].setValue(event.id);
    }
    handleSelectedRowByPensionComponent(event: any) {
        console.log(event);
        // this.ComponentRateForm.controls['pensionCategoryId'].setValue(record.primaryCategoryId);
        // this.ComponentRateForm.controls['description'].setValue(record.categoryName);
        this.ComponentRateForm.controls['breakupId'].setValue(event.id);
    }

    onSubmit() {
        console.log(this.ComponentRateForm.value);
    }

    

    // adding dynamic table
    handleRowSelection(event: any): void {
        console.log('Selected rows:', event);
    }

    handleButtonClick(event: any): void {
        console.log('Action button clicked:', event);
    }

    handQueryParameterChange(event: any): void {
        console.log('Query parameters changed:', event);
    }

    handsearchKeyChange(event: any): void {
        console.log('Search key changed:', event);
    }
}
