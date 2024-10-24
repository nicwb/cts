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
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { PrimaryRoutingModule } from './primary-routing.module';
import { PrimaryComponent } from './primary.component';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/core/dynamic-table/dynamic-table.module';


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
        CommonHeaderModule,
        MhPrimeDynamicTableModule,
        DynamicTableModule
    ],
    exports: [
        RouterModule,
        PrimaryComponent
    ],
    providers: [
        MessageService,
        ConfirmationService,
        DialogService
    ]
})
export class PrimaryModule { }
