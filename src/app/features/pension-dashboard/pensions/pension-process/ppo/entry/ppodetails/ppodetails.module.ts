import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StepsModule } from 'primeng/steps';

import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { PpodetailsComponent } from './ppodetails.component';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { DetailsComponent } from './details/details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { SanctionModule } from './sanction/sanction.module';
import { FamilyNomineeModule } from './family-nominee/family-nominee.module';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
// md - 50
// import { FloatLabe } ;

const routes: Routes = [
  { path: '', component: PpodetailsComponent },
];




@NgModule({
  declarations: [PpodetailsComponent, DetailsComponent, BankDetailsComponent],
  imports: [
    SanctionModule,
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,    
    DynamicTableModule,
    OptionCardModule,
    CommonHeaderModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    TreasuryDropdownModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
    RouterModule,
    BrowserModule,
    InputTextareaModule,
    BrowserModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    SelectButtonModule,
    CardModule,
    BrowserModule,
    FormsModule,
    DropdownModule,
    CheckboxModule,
    InputTextModule,
    StepsModule,
    PanelModule,
    FieldsetModule,
    FamilyNomineeModule,
    PopupTableModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: [PpodetailsComponent],
  exports: [RouterModule]
})
export class PpodetailsModule { }
