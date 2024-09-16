import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentMandateComponent } from './payment-mandate.component';

const routes: Routes = [
    {path:"",component:PaymentMandateComponent},
    {path:"short-list",loadChildren: ()=>import('./pay-mandate-shortlist/pay-mandate-shortlist.module').then(m=>m.PayMandateShortlistModule)}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentMandateRoutingModule { }
