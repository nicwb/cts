import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionsProcessComponent } from './pensions-process.component';
const routes: Routes = [
    { path: '', component: PensionsProcessComponent, data: { breadcrumb: 'PensionsProcessComponent' }},
    {
        path: 'approval',
        loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule),
        data: { breadcrumb: 'ApprovalModule' }
    },
    {
        path: 'ppo',
        loadChildren: () => import('./ppo/ppo.module').then(m => m.PpoModule),
        data: { breadcrumb: 'PpoModule' }
    },
    {
        path: 'pension-details',
        loadChildren: () => import('./pensioner-details/pensioner-details.module').then(m => m.PensionerDetailsModule),
        data: { breadcrumb: 'PensionerDetailsModule'}
    },
    {
        path: 'pension-bill',
        loadChildren: () => import('./pension-bill/pension-bill.module').then(m => m.PensionBillModule),
        data: { breadcrumb: 'PensionBillModule'}
    },
    {
        path: 'bill-print',
        loadChildren: () => import('./bill-print/bill-print.module').then(m => m.BillPrintModule),
        data: { breadcrumb: 'BillPrintModule'}
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionsProcessRoutingModule { }
