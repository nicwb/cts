// search-popup.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SearchPopupComponentTemp } from './ search-popup.component';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
@NgModule({
  declarations: [SearchPopupComponentTemp],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TableModule,
    FormsModule,
    InputTextModule
  ],
  exports: [SearchPopupComponentTemp]
})
export class SearchPopupTempModule { }
