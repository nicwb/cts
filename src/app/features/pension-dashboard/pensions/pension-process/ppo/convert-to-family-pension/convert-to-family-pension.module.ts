import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { ConvertToFamilyPensionComponent } from './convert-to-family-pension.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule } from 'primeng/fieldset';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: '', component: ConvertToFamilyPensionComponent },
];


@NgModule({
  declarations: [
    ConvertToFamilyPensionComponent
  ],
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
    InputNumberModule,
    FieldsetModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConvertToFamilyPensionModule { }
