import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DynamicTableModule,
    MhPrimeDynamicTableModule,
    TableModule,
    ButtonModule,
    PopupTableModule
  ]
})
export class FirstPensionModule { }
