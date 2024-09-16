import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineBillReceiveComponent } from './online-bill-receive.component';

const routes: Routes = [
    { path: '', component: OnlineBillReceiveComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnlineBillReceiveRoutingModule { }
