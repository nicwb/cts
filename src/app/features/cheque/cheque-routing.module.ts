import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeComponent } from './cheque.component';
import { ChequeIndentComponent } from './cheque-indent-invoice/cheque-indent/cheque-indent.component';
import { ChequeInvoiceComponent } from './cheque-indent-invoice/cheque-invoice/cheque-invoice.component';
import { NewInvoiceComponent } from './cheque-indent-invoice/cheque-invoice/new-invoice/new-invoice.component';

const routes: Routes = [
    { path: "", component: ChequeComponent },
    { path: 'cheque-entry', loadChildren: () => import('./cheque-entry/cheque-entry.module').then(m => m.ChequeEntryModule) },
    { path: 'cheque-indent-invoice', loadChildren: () => import('./cheque-indent-invoice/cheque-indent-invoice.module').then(m => m.ChequeIndentInvoiceModule) },
    { path: 'cheque-distribution', loadChildren: () => import('./cheque-distribution/cheque-distribution.module').then(m => m.ChequeDistributionModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChequeRoutingModule { }
