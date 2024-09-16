import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillCheckingComponent } from './bill-checking.component';

const routes: Routes = [
    {path:"",component:BillCheckingComponent},
    { path: 'new-bill-check', loadChildren: () => import('./new-bill-check/new-bill-check.module').then(m => m.NewBillCheckModule)},
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillCheckingRoutingModule { }
