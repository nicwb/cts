import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { PpoComponent } from './ppo.component';
import { PpoReceiptComponent } from './ppo-receipt/ppo-receipt.component';
import { PpoReceiptModule } from './ppo-receipt/ppo-receipt.module';
import { LifeCertificateComponent } from './life-certificate/life-certificate.component';
import { LifeCertificateModule } from './life-certificate/life-certificate.module';
import { DetailsComponent } from './ppodetails/details/details.component';
import { PpodetailsComponent } from './ppodetails/ppodetails.component';
const routes: Routes = [
    {
        path: '', component: PpoComponent, data: {breadcrumb: 'PpoComponent'}
    },
    {
        path: 'entry',
        loadChildren: () => import('./ppodetails/ppodetails.module').then(m => m.PpodetailsModule),
        data: {breadcrumb: 'PpodetailsModule'}
    },
    {
        path: ':ppoId/edit', // Define the nested route here
        component: PpodetailsComponent,
    },
    {
        path: 'ppo-receipt',
        component: PpoReceiptComponent,
        data: { breadcrumb: 'PpoReceiptComponent'}

    },
    {
        path: 'ppo-receipt/new',
        component: PpoReceiptComponent,
        data: { breadcrumb: 'PpoReceiptComponent'}

    },
    {
        path: 'life-certificate',
        component: LifeCertificateComponent,
        data: { breadcrumb: 'LifeCertificateComponent'}

    },
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
        TreasuryDropdownModule,
        FormsModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule, PpoComponent]
})
export class PpoModule { }
