import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewBillCheckRoutingModule } from './new-bill-check-routing.module';
import { NewBillCheckComponent } from './new-bill-check.component';
import { StepsModule } from 'primeng/steps';
import { RouterModule } from '@angular/router';
import { BillDetailsComponent } from './bill-details/bill-details.component';
import { ListOfObjectionComponent } from './list-of-objection/list-of-objection.component';
import { TableModule } from 'primeng/table';
import { AllotmentComponent } from './allotment/allotment.component';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ByTransferComponent } from './by-transfer/by-transfer.component';
import { PlTransferComponent } from './pl-transfer/pl-transfer.component';
import { PanelModule } from 'primeng/panel';
import {DividerModule} from 'primeng/divider';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from '@angular/forms';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {DialogModule} from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BadgeModule } from 'primeng/badge';
@NgModule({
    declarations: [NewBillCheckComponent, AllotmentComponent,BillDetailsComponent, ListOfObjectionComponent, ByTransferComponent, PlTransferComponent],
    exports: [RouterModule],
    imports: [
        CommonModule,
        NewBillCheckRoutingModule,
        StepsModule,
        TableModule,
        ListboxModule,
        ButtonModule,
        CardModule,
        PanelModule,
        DividerModule,
        OverlayPanelModule,
        InputTextModule,
        FormsModule,
        ConfirmPopupModule,
        DialogModule,
        FieldsetModule,
        InputTextareaModule,
        BadgeModule,
        RouterModule.forChild([
            {
                path: '',
                component: NewBillCheckComponent,
                children: [
                    { path: '', redirectTo: 'bill-details', pathMatch: 'full' },
                    { path: 'bill-details', component: BillDetailsComponent },
                    { path: 'objection', component: ListOfObjectionComponent },
                    { path: 'allotment', component: AllotmentComponent },
                ],
            },
        ]),
    ]
})
export class NewBillCheckModule { }
