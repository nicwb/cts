import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FirstpensionbillapprovalComponent} from './firstpensionbillapproval.component'
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { SearchPopupTempModule } from 'src/app/core/searchpopup/search-popup.module';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    FirstpensionbillapprovalComponent
  ],
  imports: [
    CommonModule,
    PopupTableModule,
    SearchPopupTempModule,
    DividerModule
  ]
})
export class FirstpensionbillapprovalModule { }
