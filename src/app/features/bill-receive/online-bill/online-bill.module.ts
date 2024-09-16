import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineBillRoutingModule } from './online-bill-routing.module';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { OnlineBillComponent } from './online-bill.component';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

@NgModule({
    declarations: [OnlineBillComponent],
    imports: [
        CommonModule,
        OnlineBillRoutingModule,
        DividerModule,
        CalendarModule,
        CardModule,
        PanelModule
    ]
})
export class OnlineBillModule { }
