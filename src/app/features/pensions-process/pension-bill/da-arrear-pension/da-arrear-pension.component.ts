import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import {
    PensionCategoryMasterService,
    PensionComponentService,
} from 'src/app/api';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';

@Component({
    selector: 'app-da-arrear-pension',
    templateUrl: './da-arrear-pension.component.html',
    styleUrls: ['./da-arrear-pension.component.scss'],
    standalone: true,
    imports: [
        DividerModule,
        TableModule,
        PopupTableModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CalendarModule,
    ],
})
export class DaArrearPensionComponent implements OnInit {
    DaArrearPensionForm: FormGroup = new FormGroup({});
    allPensionCategory2$?: Observable<any>;
    pensionComponent2$?: Observable<any>;
    category_id?: string;
    category_description?: string;
    component_id?: string;
    component_description?: string;
    previous_breakup_id?: string;
    previous_description?: string;
    effective_from_date?: string;
    percentage?: string;
    CRV?: string;
    EFD?: string;
    PRV?: string;
    PEFD?: string;
    no_of_months?: string;

    constructor(
        private pensionCategoryMasterService: PensionCategoryMasterService,
        private pensionComponentService: PensionComponentService
    ) {}

    ngOnInit(): void {
        this.allPensionCategory2$ =
            this.pensionCategoryMasterService.getCategories();
        this.pensionComponent2$ = this.pensionComponentService.getComponents();
    }
    // for category button
    handleSelectedRowByPensionCategory2(event: any) {
        this.DaArrearPensionForm.controls['categoryId'].setValue(event.id);
        this.DaArrearPensionForm.controls['categoryName'].setValue(
            event.categoryName
        );
    }
    // for component or breakup button
    handleSelectedRowByPensionComponent2(event: any) {
        this.DaArrearPensionForm.controls['breakupId'].setValue(event.id);
        this.DaArrearPensionForm.controls['componentName'].setValue(
            event.componentName
        );
    }
    saveData() {
        console.log(this.DaArrearPensionForm.value);
    }
}
