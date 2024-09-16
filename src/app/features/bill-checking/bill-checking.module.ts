import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillCheckingRoutingModule } from './bill-checking-routing.module';
import {StepsModule} from 'primeng/steps';
import { BillCheckingComponent } from './bill-checking.component';
import { BillDetailsComponent } from './new-bill-check/bill-details/bill-details.component';
import { ListOfObjectionComponent } from './new-bill-check/list-of-objection/list-of-objection.component';
import { ByTransferComponent } from './new-bill-check/by-transfer/by-transfer.component';
import { PlTransferComponent } from './new-bill-check/pl-transfer/pl-transfer.component';
import { NewBillCheckComponent } from './new-bill-check/new-bill-check.component';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { TokenListModule } from 'src/app/shared/modules/token-list/token-list.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import {ButtonModule} from 'primeng/button';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';

@NgModule({
    declarations: [BillCheckingComponent],
    imports: [
        CommonModule,
        BillCheckingRoutingModule,
        StepsModule,
        TableModule,
        ListboxModule,
        TokenListModule,
        ButtonModule,
        CommonHeaderModule,
        DynamicTableModule,
        MhPrimeDynamicTableModule,
        NgxPermissionsModule.forChild()
    ]
})
export class BillCheckingModule { }
