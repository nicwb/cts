import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeDistributionComponent } from './cheque-distribution.component';

const routes: Routes = [
    {path:"",component:ChequeDistributionComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChequeDistributionRoutingModule { }
