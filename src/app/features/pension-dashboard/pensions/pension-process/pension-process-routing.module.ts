import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionProcessComponent } from './pension-process.component';
import { PpoComponent } from './ppo/ppo.component';
import { EntryComponent } from './ppo/entry/entry.component';
import { PensionerDetailsComponent } from './pensioner-details/pensioner-details.component';
import {PensionBillComponent} from './pension-bill/pension-bill.component'
import { ArrearPensionComponent } from './arrear-pension/arrear-pension.component';
import { BillPrintComponent } from './bill-print/bill-print.component';
import { ApprovalComponent } from './approval/approval.component';

const routes: Routes = [


    {path: '', component: PensionProcessComponent, data: { breadcrumb: 'PensionProcessComponent' }},
    {path: 'ppo', component: PpoComponent, data: { breadcrumb: 'PpoComponent' }},
    {path: 'pensioner-details', component: PensionerDetailsComponent, data: { breadcrumb: 'PensionerDetailsComponent' }},
    {path: 'pension-bill',component:PensionBillComponent, data: { breadcrumb: 'PensionBillComponent' }},
    {path:'app-arrear-pension',component:ArrearPensionComponent, data: { breadcrumb: 'ArrearPensionComponent' }},
    {path: 'bill-print', component: BillPrintComponent, data: { breadcrumb: 'BillPrintComponent' }},
    {path: 'approval', component: ApprovalComponent, data: { breadcrumb: 'ApprovalComponent' }},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionProcessRoutingModule { }
