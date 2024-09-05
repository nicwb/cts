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
import { PpodetailsModule } from './ppodetails/ppodetails.module';
import { SanctionComponent } from './ppodetails/sanction/sanction.component';

const routes: Routes = [
  { path: '', component: EntryComponent },
  {
    path: 'sanction',
    data: { breadcrumb: 'Sanction' },
    loadChildren: () => import('./ppodetails/sanction/sanction.module').then(m => m.SanctionModule),
  },
  {
    path: 'family-nominee',
    data: { breadcrumb: 'Family Nominee' },
    loadChildren: () =>
      import('./ppodetails/family-nominee/family-nominee.module').then(m => m.FamilyNomineeModule),
  },
  

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
    PpodetailsModule,
    RouterModule.forChild(routes),
  ],
})
export class EntryModule {}
