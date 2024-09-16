import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeIndentInvoiceRoutingModule } from './cheque-indent-invoice-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { ChequeRoutingModule } from '../cheque-routing.module';
import { ChequeIndentInvoiceComponent } from './cheque-indent-invoice.component';
import { ChequeIndentComponent } from './cheque-indent/cheque-indent.component';
import { ChequeInvoiceComponent } from './cheque-invoice/cheque-invoice.component';
import { NewInvoiceComponent } from './cheque-invoice/new-invoice/new-invoice.component';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {DividerModule} from 'primeng/divider';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MessageModule } from 'primeng/message';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { MicrModule } from 'src/app/shared/modules/micr/micr.module';
import { ChequeReceivedComponent } from './cheque-received/cheque-received.component';

@NgModule({
    declarations: [ChequeIndentInvoiceComponent,ChequeIndentComponent,ChequeInvoiceComponent,NewInvoiceComponent, ChequeReceivedComponent],
    imports: [
        CommonModule,
        ChequeIndentInvoiceRoutingModule,
        ChequeRoutingModule,
        CommonHeaderModule,
        ButtonModule,
        OptionCardModule,
        CardModule,
        CalendarModule,
        InputTextareaModule,
        DropdownModule,
        FormsModule,
        RippleModule,
        ReactiveFormsModule,
        DialogModule,
        HttpClientModule,
        ConfirmDialogModule,
        DynamicTableModule,
        DividerModule ,
        MessageModule,
        TreasuryDropdownModule,
        MicrModule,
        NgxPermissionsModule.forChild() 
    ]
})
export class ChequeIndentInvoiceModule { }
