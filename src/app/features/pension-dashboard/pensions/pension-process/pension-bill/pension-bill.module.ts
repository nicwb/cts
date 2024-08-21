
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
import { SearchPopupTempModule } from 'src/app/core/searchpopup/search-popup.module';
import { MessageService } from 'primeng/api';

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
    DialogModule,SearchPopupTempModule

  ],
  providers: [MessageService],
  
  exports: [RouterModule],
})
export class PensionBillModule { }
