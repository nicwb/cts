import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegularPensionBillComponent } from './regular-pension-bill.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { DividerModule } from 'primeng/divider';



@NgModule({
    declarations: [RegularPensionBillComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
        CalendarModule,
        ProgressBarModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DialogModule,
        CalendarModule,
        PopupTableModule,
        DividerModule,
        ProgressBarModule,
    ]
})
export class RegularPensionBillModule { }
