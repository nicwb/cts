import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdsDetailsRoutingModule } from './tds-details-routing.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { TdsDetailsComponent } from './tds-details.component';
import { VendorDetailsWiseEC137Component } from './vendor-details-wise-ec137/vendor-details-wise-ec137.component';
import { VendorWiseEC136Component } from './vendor-wise-ec136/vendor-wise-ec136.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { TableModule } from 'primeng/table';
import { FromToDateFormComponent } from './shared/from-to-date-form/from-to-date-form.component';


@NgModule({
  declarations: [TdsDetailsComponent, VendorDetailsWiseEC137Component, VendorWiseEC136Component, FromToDateFormComponent],
  imports: [
    CommonModule,
    TdsDetailsRoutingModule,
    OptionCardModule,
    ReactiveFormsModule,
    CommonHeaderModule,
    MhPrimeDynamicTableModule,
    DynamicTableModule,
    CalendarModule,
    TableModule,
    FormsModule,
  ],
})
export class TdsDetailsModule { }
