import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { ConvertToFamilyPensionComponent } from './convert-to-family-pension.component';



const routes: Routes = [
    { path: '', component: ConvertToFamilyPensionComponent, data: { breadcrumb: 'ConvertToFamilyPensionComponent' } },
];


@NgModule({
    declarations: [
        ConvertToFamilyPensionComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,    
        DynamicTableModule,
        OptionCardModule,
        ButtonModule,
        CommonHeaderModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        ReactiveFormsModule,
        TreasuryDropdownModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        ProgressBarModule,
        ToastModule,
        SliderModule,
        RatingModule,
        InputNumberModule,
        FieldsetModule,
        CheckboxModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ConvertToFamilyPensionModule { }
