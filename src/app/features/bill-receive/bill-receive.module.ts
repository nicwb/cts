import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillReceiveRoutingModule } from './bill-receive-routing.module';
import { BillReceiveComponent } from './bill-receive.component';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BillReceiveListComponent } from './bill-receive-list/bill-receive-list.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {DialogModule} from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { SharedModule } from 'src/app/shared/modules/shared.module';
@NgModule({
    declarations: [BillReceiveComponent, BillReceiveListComponent],
    imports: [
        CommonModule,
        BillReceiveRoutingModule,
        ButtonModule,
        TableModule,
        CardModule,
        ConfirmPopupModule,
        DialogModule,
        MessagesModule,
        SharedModule
    ]
})
export class BillReceiveModule { }
