import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionReportsComponent } from './pension-reports.component';
import { ManualPpoRegisterComponent } from './manual-ppo-register/manual-ppo-register.component';

const routes: Routes = [


  {path: '', component: PensionReportsComponent},
  {
    path : 'manual-ppo-register',
    data: { breadcrumb: 'Manual PPO Register' },
    loadChildren: () => import('./manual-ppo-register/manual-ppo-register.module').then(m => m.ManualPpoRegisterModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PensionReportsRoutingModule { }
