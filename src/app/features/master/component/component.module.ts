import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import {  ComponentComponent } from './component.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';

import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { RadioButtonModule } from 'primeng/radiobutton';

import { AutoCompleteModule } from "primeng/autocomplete";
import { ChipsModule } from "primeng/chips";
import { ChipModule } from "primeng/chip";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ColorPickerModule } from 'primeng/colorpicker';

@NgModule({
    declarations: [ComponentComponent],
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        SliderModule,
        RatingModule,
        DynamicTableModule,
        OptionCardModule,
        CommonHeaderModule,
        DialogModule,
        CalendarModule,
        TreasuryDropdownModule,
        ReactiveFormsModule,
        MhPrimeDynamicTableModule,
        RadioButtonModule,
        AutoCompleteModule,
        ChipsModule,
        ChipModule,
        InputMaskModule,
        InputNumberModule,
        CascadeSelectModule,
        InputTextareaModule,
        KnobModule,
        ListboxModule,
        SelectButtonModule,
        CheckboxModule,
        InputSwitchModule,
        ColorPickerModule,

    ],
    exports:[ComponentComponent]
})
export class ComponentModule { }
