import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubCategoryRoutingModule } from './sub-category-routing.module';
import { SubCategoryComponent } from './sub-category.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
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
import { SplitButtonModule } from 'primeng/splitbutton';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';

import { DynamicTableModule } from 'src/app/core/dynamic-table/dynamic-table.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';


@NgModule({
    declarations: [SubCategoryComponent],
    imports: [
        CommonModule,
        SubCategoryRoutingModule,
        OptionCardModule,
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
        RippleModule,
        SplitButtonModule,
        ToggleButtonModule,
        MultiSelectModule,
        ProgressBarModule,
        SliderModule,
        DynamicTableModule,
        CommonHeaderModule,
        CalendarModule,
        TreasuryDropdownModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        ProgressBarModule,
        SliderModule,
        MhPrimeDynamicTableModule,
        DynamicTableModule

    ],
    exports: [SubCategoryComponent]
})
export class SubCategoryModule { }
