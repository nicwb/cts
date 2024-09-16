import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampsComponent } from './stamps.component';
import { IndentCaptureComponent } from './indent-capture/indent-capture.component';
import { InvoiceCaptureComponent } from './invoice-capture/invoice-capture.component';
import { InvoiceReceiveComponent } from './invoice-receive/invoice-receive.component';
import { StampWalletRefillComponent } from './stamp-wallet-refill/stamp-wallet-refill.component';

const routes: Routes = [{path: '', component: StampsComponent},
    {path: 'indent-capture', component: IndentCaptureComponent},
    {path: 'invoice-capture', component: InvoiceCaptureComponent},
    {path: 'invoice-receive', component: InvoiceReceiveComponent},
    {path: 'stamp-wallet-refill', component: StampWalletRefillComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StampsRoutingModule { }
