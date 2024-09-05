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
  {path: 'ppo',data: { breadcrumb: 'PPO' }, component: PpoComponent},
  {path: 'pensioner-details', component: PensionerDetailsComponent},
  {path: 'pension-bill',component:PensionBillComponent},
  {path:'app-arrear-pension',component:ArrearPensionComponent},
  {path: 'bill-print', component: BillPrintComponent},
  {path: 'approval', component: ApprovalComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PensionProcessRoutingModule { }
