import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
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
import { RegularPensionBillComponent } from './regular-pension-bill/regular-pension-bill.component';
import { ProgressBarModule } from 'primeng/progressbar';

const routes: Routes = [
    {
        path: '',
        component: PensionBillComponent
    },
    {
        path: '/:ppoId',
        component: PensionBillComponent
    }
];

@NgModule({
    declarations: [
        PensionBillComponent,
        RegularPensionBillComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ButtonModule,
        DropdownModule,
        ChipsModule,
        ToastModule,
        RatingModule,
        TableModule,
        DialogModule,
        CalendarModule,
        PopupTableModule,
        DividerModule,
        ProgressBarModule,

    ],
    providers: [MessageService],
  
    exports: [],
})
export class PensionBillModule { }
