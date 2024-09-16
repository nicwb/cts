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
import { ConfirmationService, MessageService } from 'primeng/api';


import { PrimaryRoutingModule } from './primary-routing.module';
import { PrimaryComponent } from './primary.component';


@NgModule({
    declarations: [PrimaryComponent],
    imports: [
        CommonModule,
        PrimaryRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
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

    ],
    providers: [
        MessageService,
        ConfirmationService,
        DialogService
    ]
})
export class PrimaryModule { }
