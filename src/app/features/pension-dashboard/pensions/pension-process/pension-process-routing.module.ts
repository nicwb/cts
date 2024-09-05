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


  {path: '', component: PensionProcessComponent},
  {
    path: 'ppo',
    data: { breadcrumb: 'PPO' },
    loadChildren: () => import('./ppo/ppo.module').then(m => m.PpoModule),
  },

  {
    path: 'pension-bill',
    data: { breadcrumb: 'Pension Bill' },
    loadChildren: () => import('./pension-bill/pension-bill.module').then(m => m.PensionBillModule),
  },

  {
    path: 'pensioner-details',
    data: { breadcrumb: 'Pensioner Details' },
    loadChildren: () => import('./pensioner-details/pensioner-details.module').then(m => m.PensionerDetailsModule),
  },
  {
    path: 'bill-print',
    data: { breadcrumb: 'Bill Print' },
    loadChildren: () => import('./bill-print/bill-print.module').then(m => m.BillPrintModule)
  },
  {
    path : 'approval',
    data: { breadcrumb: 'Approval' },
    loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule),
  },
  {
    path: 'app-arrear-pension',
    data: { breadcrumb: 'Arrear Pension' },
    loadChildren: () => import('./arrear-pension/arrear-pension.module').then(m => m.ArrearPensionModule),
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PensionProcessRoutingModule { }
