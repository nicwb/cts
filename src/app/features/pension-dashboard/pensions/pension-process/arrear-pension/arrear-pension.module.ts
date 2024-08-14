
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
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { SearchPopupComponent } from 'src/app/core/search-popup/search-popup.component';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ArrearPensionRoutingModule } from './arrear-pension-routing.module';
import { ArrearPensionComponent } from './arrear-pension.component';


@NgModule({
  declarations: [ArrearPensionComponent,
    SearchPopupComponent],
  imports: [
    CommonModule,
    ArrearPensionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ButtonModule,
    DropdownModule,
    ChipsModule,
    TableModule,
    ToastModule,
    RatingModule,
    DialogModule,
    DynamicDialogModule,

  ],
  exports: [
    RouterModule,
    SearchPopupComponent
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService
  ]
})
export class ArrearPensionModule { }
