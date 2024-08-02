import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    OptionCardModule,
    ReportsRoutingModule,
  ]
})
export class ReportsModule { }
