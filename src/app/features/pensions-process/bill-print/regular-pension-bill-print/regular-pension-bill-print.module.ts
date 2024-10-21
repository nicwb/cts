import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegularPensionBillPrintComponent } from './regular-pension-bill-print.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';

@NgModule({
    declarations: [RegularPensionBillPrintComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        AutoCompleteModule,
        CalendarModule,
        CascadeSelectModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        ColorPickerModule,
        DialogModule,
        DynamicDialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        InputMaskModule,
        InputNumberModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        ListboxModule,
        MultiSelectModule,
        PanelModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        SelectButtonModule,
        SliderModule,
        SplitButtonModule,
        TableModule,
        ToastModule,
        ToggleButtonModule,
        CommonHeaderModule,
        DynamicTableModule,
        OptionCardModule,
        MhPrimeDynamicTableModule,
        PopupTableModule,
    ],
    providers: [DialogService],
    exports: [RegularPensionBillPrintComponent]
})
export class RegularPensionBillPrintModule { }
