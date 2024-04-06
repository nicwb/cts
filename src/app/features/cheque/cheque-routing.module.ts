import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeComponent } from './cheque.component';
import { ChequeIndentComponent } from './cheque-indent-invoice/cheque-indent/cheque-indent.component';
import { ChequeInvoiceComponent } from './cheque-indent-invoice/cheque-invoice/cheque-invoice.component';

const routes: Routes = [
  {path:"",component:ChequeComponent},
  {path:'cheque-entry',loadChildren:()=>import('./cheque-entry/cheque-entry.module').then(m=>m.ChequeEntryModule)},
  {path:'cheque-indent-invoice',loadChildren:()=>import('./cheque-indent-invoice/cheque-indent-invoice.module').then(m=>m.ChequeIndentInvoiceModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequeRoutingModule { }
