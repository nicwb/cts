import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChequeDistributionRoutingModule } from './cheque-distribution-routing.module';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ChequeDistributionComponent } from './cheque-distribution.component';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { NewDistributionComponent } from './new-distribution/new-distribution.component';
import {ListboxModule} from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
    declarations: [ChequeDistributionComponent, NewDistributionComponent],
    imports: [
        CommonModule,
        ChequeDistributionRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
        ButtonModule,
        DialogModule,
        CommonHeaderModule,
        DynamicTableModule,
        ListboxModule,
        TableModule,
        CalendarModule

    ]
})
export class ChequeDistributionModule { }
