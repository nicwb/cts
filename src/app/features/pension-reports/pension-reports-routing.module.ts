import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionReportsComponent } from './pension-reports.component';
import { ManualPpoRegisterComponent } from './manual-ppo-register/manual-ppo-register.component';

const routes: Routes = [


    {path: '', component: PensionReportsComponent, data: { breadcrumb: 'PensionReportsComponent' }},
    {path: 'manual-ppo-register', component: ManualPpoRegisterComponent, data: { breadcrumb: 'ManualPpoRegisterComponent' }},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionReportsRoutingModule { }
