import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstPensionBillPrintComponent } from './first-pension-bill.print.component';
import { DividerModule } from 'primeng/divider';

import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
    declarations: [FirstPensionBillPrintComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        PopupTableModule,
        ReactiveFormsModule,
        DividerModule,
        RadioButtonModule,
    ],
})
export class FirstPensionBillPrintModule {}
