import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StepsModule } from 'primeng/steps';

import { DynamicTableModule } from 'src/app/core/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { PensionEPPOReceiptService } from 'src/app/api';

@Component({
    selector: 'app-e-ppo',
    templateUrl: './e-ppo.component.html',
    styleUrls: ['./e-ppo.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,
        OptionCardModule,
        ButtonModule,
        CommonHeaderModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        TreasuryDropdownModule,
        FormsModule,
        RadioButtonModule,
        DividerModule,
        InputTextModule,
        DynamicTableModule,
        CalendarModule,
        InputTextareaModule,
        StepsModule,
        CardModule,
        SelectButtonModule,
        CheckboxModule,
        PanelModule,
        FieldsetModule,
        TableModule,
    ],
})
export class EPPOComponent implements OnInit {
    pages: string = 'page1';

    years: any[] = [];
    selectedYear: any;
    date: Date | undefined;
    selectedMonth: any;
    searched = false;
    suffix = 'suffix name';
    myService$?: Observable<any>;
    constructor(private eppo: PensionEPPOReceiptService) {}

    ngOnInit(): void {
        this.date = new Date();
        for (let i = 1999; i <= this.date.getFullYear(); i++) {
            this.years.push({ label: `${i}-${i + 1}`, value: `${i}-${i + 1}` });
        }
        this.selectedYear = this.years[this.years.length - 1];
    }
    changed() {
        console.log(this.pages);
    }
    search() {
        console.log('search');
        this.searched = true;
    }
}
