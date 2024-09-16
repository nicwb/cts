import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeIndentComponent } from './cheque-indent/cheque-indent.component';
import { ChequeInvoiceComponent } from './cheque-invoice/cheque-invoice.component';
import { ChequeIndentInvoiceComponent } from './cheque-indent-invoice.component';
import { NewInvoiceComponent } from './cheque-invoice/new-invoice/new-invoice.component';
import { ChequeReceivedComponent } from './cheque-received/cheque-received.component';

const routes: Routes = [
    {path:"",component:ChequeIndentInvoiceComponent},
    {path:'cheque-indent', component:ChequeIndentComponent},
    {path:'cheque-invoice', component:ChequeInvoiceComponent},
    {path:"approved-cheque-indent/:id",component:NewInvoiceComponent},
    {path:'cheque-received/:id',component: ChequeReceivedComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChequeIndentInvoiceRoutingModule { }
