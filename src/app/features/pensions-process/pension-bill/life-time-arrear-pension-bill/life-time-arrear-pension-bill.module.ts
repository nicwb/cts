import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { LifeCertificateComponent } from '../../ppo/life-certificate/life-certificate.component';
import { LifeTimeArrearPensionBillComponent } from './life-time-arrear-pension-bill.component';

@NgModule({
    declarations: [LifeTimeArrearPensionBillComponent],
    imports: [
        CommonModule,
        RouterModule,
        OptionCardModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CalendarModule,
        DialogModule,
        DropdownModule,
        CommonHeaderModule,
        DynamicTableModule,
        TreasuryDropdownModule,
        ChipsModule,
        TableModule,
        ToastModule,
        RatingModule,
        PopupTableModule,
        DividerModule,
        ProgressBarModule,
    ],
})
export class LifeTimeArrearPensionBillModule {}
