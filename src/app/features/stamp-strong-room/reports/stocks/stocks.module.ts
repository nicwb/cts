import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocksRoutingModule } from './stocks-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { StocksComponent } from './stocks.component';
import { StampStockRegisterComponent } from './stamp-stock-register/stamp-stock-register.component';
import { EcFormModule } from "../shared/ec-form/ec-form.module";


@NgModule({
  declarations: [StocksComponent, StampStockRegisterComponent],
  imports: [
    CommonModule,
    StocksRoutingModule,
    OptionCardModule,
    ReactiveFormsModule,
    CommonHeaderModule,
    MhPrimeDynamicTableModule,
    DynamicTableModule,
    CalendarModule,
    TableModule,
    FormsModule,
    EcFormModule
]
})
export class StocksModule { }
