import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineBillComponent } from './online-bill.component';

const routes: Routes = [
    {path:'', component:OnlineBillComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnlineBillRoutingModule { }
