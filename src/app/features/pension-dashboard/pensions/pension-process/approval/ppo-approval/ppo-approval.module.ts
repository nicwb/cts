import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SearchPopupTempModule } from 'src/app/core/searchpopup/search-popup.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SearchPopupTempModule,
    TableModule
  ]
})
export class PpoApprovalModule { }
