import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionBillComponent } from './pension-bill.component';
// import { PensionBillComponent } from './pension-bill.component';

const routes: Routes = [
    {path:'', component:PensionBillComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionBillRoutingModule { }
