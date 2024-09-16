import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewBillCheckComponent } from './new-bill-check.component';


const routes: Routes = [
    {path:'',component:NewBillCheckComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewBillCheckRoutingModule { }
