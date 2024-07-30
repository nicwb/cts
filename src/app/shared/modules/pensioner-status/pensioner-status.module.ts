import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';

import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DropdownModule } from 'primeng/dropdown';
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
import { PensionerStatusComponent } from './pensioner-status.component';



@NgModule({
  declarations: [PensionerStatusComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,    
    DynamicTableModule,
    OptionCardModule,
    ButtonModule,
    CommonHeaderModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    ReactiveFormsModule,
    TreasuryDropdownModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ToggleButtonModule,
    RippleModule,
    MultiSelectModule,
    ProgressBarModule,
    ToastModule,
    SliderModule,
    RatingModule,
    MhPrimeDynamicTableModule
  ],
  exports: [PensionerStatusComponent]
})
export class PensionerStatusModule { }
