// dynamic-table.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import { DynamicTableComponent } from './dynamic-table.component';

@NgModule({
    declarations: [DynamicTableComponent],
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        TableModule,
        FormsModule,
        InputTextModule,

    ],
    exports: [DynamicTableComponent]
})
export class DynamicTableModule { }
