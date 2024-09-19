import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { SanctionComponent } from './entry/ppodetails/sanction/sanction.component';
import { ManualPpoReceiptComponent } from './manual-ppo-receipt/manual-ppo-receipt.component';
import { PpoComponent } from './ppo.component';
import { PpodetailsComponent } from './entry/ppodetails/ppodetails.component';



const routes: Routes = [
    {path: '', component: PpoComponent, data: { breadcrumb: 'PpoComponent' }},
    {path: 'entry', component: PpodetailsComponent, data: { breadcrumb: 'PpodetailsComponent' }},
    {path: 'manualPpoReceipt', component: ManualPpoReceiptComponent, data: { breadcrumb: 'ManualPpoReceiptComponent' }},
    {path: 'sanction', component: SanctionComponent, data: { breadcrumb: 'SanctionComponent' }},
    {
        path: ':receiptId/receipt',
        component: ManualPpoReceiptComponent,
        data: { breadcrumb: 'ManualPpoReceiptComponent' }
    }
];


@NgModule({
    declarations: [PpoComponent],
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
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class PpoModule { }
