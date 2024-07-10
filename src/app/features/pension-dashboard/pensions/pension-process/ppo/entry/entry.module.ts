import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { EntryComponent } from './entry.component';
import { PpodetailsComponent } from './ppodetails/ppodetails.component';

const routes: Routes = [
  { path: '', component: EntryComponent },
  { path: 'ppodetails', component: PpodetailsComponent },
];

@NgModule({
  declarations: [EntryComponent], // Ensure both components are declared
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DynamicTableModule,
    OptionCardModule,
    CommonHeaderModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    TreasuryDropdownModule,
    RouterModule.forChild(routes),
  ],
})
export class EntryModule {}
