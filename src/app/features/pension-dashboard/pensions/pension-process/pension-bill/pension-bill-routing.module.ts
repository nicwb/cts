import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionBillComponent } from './pension-bill.component';
import { FirstPensionPensionBillModule } from './first-pension-pension-bill/first-pension-pension-bill.module';
import { RegularPensionComponent } from '../bill-print/regular-pension/regular-pension.component';
import { RegularPensionPensionBillModule } from './regular-pension-pension-bill/regular-pension-pension-bill.module';
// import { PensionBillComponent } from './pension-bill.component';

const routes: Routes = [
    {path:'', component:PensionBillComponent},
    {path:'first-pension-pension-bill', component:FirstPensionPensionBillModule},
    { path: 'regular-pension-pension-bill', component: RegularPensionPensionBillModule}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionBillRoutingModule { }
