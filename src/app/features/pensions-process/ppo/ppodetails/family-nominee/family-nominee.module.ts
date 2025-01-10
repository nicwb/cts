import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';

import { DynamicTableModule } from 'src/app/core/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';

import { FamilyNomineeComponent } from './family-nominee.component';

// add requirement for panel
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';

@NgModule({
    declarations: [FamilyNomineeComponent],
    imports: [
        DynamicTableModule,
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        OptionCardModule,
        CommonHeaderModule,
        DropdownModule,
        RadioButtonModule,
        DialogModule,
        CalendarModule,
        TreasuryDropdownModule,
        TableModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        ProgressBarModule,
        ToastModule,
        SliderModule,
        RatingModule,
        PanelModule,
        FieldsetModule,
        DividerModule,
    ],
    exports: [FamilyNomineeComponent, DynamicTableModule],
})
export class FamilyNomineeModule {}
