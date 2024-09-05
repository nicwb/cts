
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { PensionBillComponent } from './pension-bill.component';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { DividerModule } from 'primeng/divider';
@NgModule({
  declarations: [
    PensionBillComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ButtonModule,
    DropdownModule,
    ChipsModule,
    ToastModule,
    RatingModule,
    TableModule,
    DialogModule,
    CalendarModule,
    PopupTableModule,
    DividerModule

  ],
  providers: [MessageService],
  
  exports: [RouterModule],
})
export class PensionBillModule { }
