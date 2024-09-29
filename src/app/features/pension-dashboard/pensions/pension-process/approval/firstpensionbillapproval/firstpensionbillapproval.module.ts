import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FirstpensionbillapprovalComponent} from './firstpensionbillapproval.component'
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { DividerModule } from 'primeng/divider';

@NgModule({
    declarations: [
        FirstpensionbillapprovalComponent
    ],
    imports: [
        CommonModule,
        PopupTableModule,
        DividerModule
    ]
})
export class FirstpensionbillapprovalModule { }
