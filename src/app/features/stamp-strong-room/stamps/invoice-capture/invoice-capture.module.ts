import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceCaptureComponent } from './invoice-capture.component';
import { IncomingIndentsComponent } from './incoming-indents/incoming-indents.component';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';



@NgModule({
    declarations: [
        InvoiceCaptureComponent,
        IncomingIndentsComponent,
        InvoiceHistoryComponent
    ],
    imports: [
        CommonModule
    ]
})
export class InvoiceCaptureModule { }
