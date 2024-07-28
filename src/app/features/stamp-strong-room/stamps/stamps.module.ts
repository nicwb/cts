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
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { InvoiceReceiveComponent } from './invoice-receive/invoice-receive.component';
import { StampWalletRefillComponent } from './stamp-wallet-refill/stamp-wallet-refill.component';
import { StampCombinationDropdownModule } from 'src/app/shared/modules/stamp-combination-dropdown/stamp-combination-dropdown.module';
import { DatatableSkeletonModule } from 'src/app/shared/modules/datatable-skeleton/datatable-skeleton.module';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';


@NgModule({
  declarations: [
    StampsComponent,
    IndentCaptureComponent,
    InvoiceCaptureComponent,
    InvoiceReceiveComponent,
    StampWalletRefillComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    StampsRoutingModule,
    DynamicTableModule,
    OptionCardModule,
    ButtonModule,
    CommonHeaderModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    ToastModule,
    TagModule,
    ReactiveFormsModule,
    TreasuryDropdownModule,
    FormsModule,
    DatatableSkeletonModule,
    StampCombinationDropdownModule,
    MhPrimeDynamicTableModule
   ]
})
export class StampsModule { }
