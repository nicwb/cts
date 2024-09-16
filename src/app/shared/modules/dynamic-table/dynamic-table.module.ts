import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import {DividerModule} from 'primeng/divider';
import {DataViewModule} from 'primeng/dataview';
import {ToolbarModule} from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import {TooltipModule} from 'primeng/tooltip';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
    declarations: [DynamicTableComponent],
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        CheckboxModule,
        DropdownModule,
        MessagesModule,
        DividerModule,
        DataViewModule,
        ToolbarModule,
        SplitButtonModule,
        TooltipModule,
        FormsModule,
        InputTextModule
    ],
    exports:[
        DynamicTableComponent
    ]
})
export class DynamicTableModule { }
