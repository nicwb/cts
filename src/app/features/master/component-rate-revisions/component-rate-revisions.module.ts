import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext'; // Import InputTextModule
import { FieldsetModule } from 'primeng/fieldset'; // Import FieldsetModule
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';

import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { TableModule } from 'primeng/table';
import { ComponentRateRevisionsComponent } from './component-rate-revisions.component';
import { DividerModule } from 'primeng/divider';

@NgModule({
    declarations: [ComponentRateRevisionsComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule, 
        ButtonModule,
        RadioButtonModule,
        InputTextModule,
        FieldsetModule, 
        CalendarModule,
        DropdownModule,
        PopupTableModule,
        TableModule,  
        CommonHeaderModule ,
        DividerModule   ],
    exports: [ComponentRateRevisionsComponent],
})
export class ComponentRateRevisionsModule { }
