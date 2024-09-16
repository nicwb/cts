import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayMandateShortlistComponent } from './pay-mandate-shortlist.component';

const routes: Routes = [
    {path:"",component:PayMandateShortlistComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PayMandateShortlistRoutingModule { }
