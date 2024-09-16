import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StampsRoutingModule } from './stamps-routing.module';
import { StampsComponent } from './stamps.component';
import { IndentCaptureComponent } from './indent-capture/indent-capture.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { InvoiceCaptureComponent } from './invoice-capture/invoice-capture.component';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { StampCombinationDropdownComponent } from 'src/app/shared/modules/stamp-combination-dropdown/stamp-combination-dropdown.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { InvoiceReceiveComponent } from './invoice-receive/invoice-receive.component';
import { StampWalletRefillComponent } from './stamp-wallet-refill/stamp-wallet-refill.component';


@NgModule({
    declarations: [
        StampsComponent,
        IndentCaptureComponent,
        InvoiceCaptureComponent,
        InvoiceReceiveComponent,
        StampCombinationDropdownComponent,
        StampWalletRefillComponent,
    ],
    imports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,
        StampsRoutingModule,
        DynamicTableModule,
        OptionCardModule,
        ButtonModule,
        CommonHeaderModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        ReactiveFormsModule,
        TreasuryDropdownModule,
        FormsModule
    ]
})
export class StampsModule { }
