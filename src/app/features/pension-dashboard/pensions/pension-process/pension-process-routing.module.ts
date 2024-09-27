import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionProcessComponent } from './pension-process.component';
import { PpoComponent } from './ppo/ppo.component';
import { PensionerDetailsComponent } from './pensioner-details/pensioner-details.component';
import {PensionBillComponent} from './pension-bill/pension-bill.component'
import { ArrearPensionComponent } from './arrear-pension/arrear-pension.component';
import { BillPrintComponent } from './bill-print/bill-print.component';
import { ApprovalComponent } from './approval/approval.component';
import { RegularPensionBillComponent } from './pension-bill/regular-pension-bill/regular-pension-bill.component';

const routes: Routes = [


    {path: '', component: PensionProcessComponent, data: { breadcrumb: 'PensionProcessComponent' }},
    {path: 'ppo', component: PpoComponent, data: { breadcrumb: 'PpoComponent' }},
    {path: 'pensioner-details', component: PensionerDetailsComponent, data: { breadcrumb: 'PensionerDetailsComponent' }},
    {path: 'pension-bill',component:PensionBillComponent, data: { breadcrumb: 'PensionBillComponent' }},
    {path:'app-arrear-pension',component:ArrearPensionComponent, data: { breadcrumb: 'ArrearPensionComponent' }},
    {path: 'bill-print', component: BillPrintComponent, data: { breadcrumb: 'BillPrintComponent' }},
    {path: 'approval', component: ApprovalComponent, data: { breadcrumb: 'ApprovalComponent' }},
    {
        path: 'regular-pension-bill',
        component: RegularPensionBillComponent,
        data: { breadcrumb: 'RegularPensionBillComponent' }
    },
    {
        path: 'pension-bill',
        component: PensionBillComponent,
        data: { breadcrumb: 'PensionBillModule' }
    },
    {
        path: 'pension-bill/:ppoId',
        component: PensionBillComponent,
        data: { breadcrumb: 'PensionBillModule[:ppoId]' }
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionProcessRoutingModule { }
