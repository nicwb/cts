import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillReceiveComponent } from './bill-receive.component';
import { OnlineBillReceiveComponent } from './online-bill-receive/online-bill-receive.component';
// import { OnlineBillComponent } from './online-bill/online-bill.component';

const routes: Routes = [{ path: '', component: BillReceiveComponent },
    { path: 'online', loadChildren: () => import('./online-bill-receive/online-bill-receive.module').then(m => m.OnlineBillReceiveModule)}];
// { path: 'online', loadChildren: () => import('./online-bill/online-bill.module').then(m => m.OnlineBillModule)}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillReceiveRoutingModule { }
