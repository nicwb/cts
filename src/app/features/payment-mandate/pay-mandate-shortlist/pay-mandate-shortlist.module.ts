import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayMandateShortlistRoutingModule } from './pay-mandate-shortlist-routing.module';
import { PayMandateShortlistComponent } from './pay-mandate-shortlist.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {SelectButtonModule} from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';



@NgModule({
    declarations: [PayMandateShortlistComponent],
    imports: [
        CommonModule,
        PayMandateShortlistRoutingModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        ToggleButtonModule,
        SelectButtonModule,
        FormsModule,
        TableModule,
        CommonHeaderModule,
        InputTextModule,
        CalendarModule
    ]
})
export class PayMandateShortlistModule { }
