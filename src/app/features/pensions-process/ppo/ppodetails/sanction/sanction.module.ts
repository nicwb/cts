import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { SanctionComponent } from './sanction.component';

@NgModule({
    declarations: [SanctionComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CheckboxModule,
        SelectButtonModule,
        CardModule,
        InputTextModule,
        RadioButtonModule,
        ButtonModule,
        InputTextareaModule,
        DynamicTableModule,
        OptionCardModule,
        CommonHeaderModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        TreasuryDropdownModule,
        FieldsetModule,
    ],
    exports: [SanctionComponent],
})
export class SanctionModule { }