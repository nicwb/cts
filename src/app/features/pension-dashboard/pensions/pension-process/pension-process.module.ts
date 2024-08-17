import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from 'primeng/calendar';
import { CascadeSelectModule } from "primeng/cascadeselect";
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from "primeng/chip";
import { ChipsModule } from "primeng/chips";
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from "primeng/multiselect";
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { PensionProcessRoutingModule } from './pension-process-routing.module';
import { PensionProcessComponent } from './pension-process.component';
import { PensionerDetailsComponent } from './pensioner-details/pensioner-details.component';
import { BillPrintComponent } from './bill-print/bill-print.component';
// import { BillPrintComponent } from './bill-print/bill-print.component';


@NgModule({
  declarations: [
    PensionProcessComponent, PensionerDetailsComponent, BillPrintComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    DynamicTableModule,
    OptionCardModule,
    CommonHeaderModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    TreasuryDropdownModule,
    FormsModule,
    PensionProcessRoutingModule,
    AutoCompleteModule,
    ChipsModule,
    InputMaskModule,
    InputNumberModule,
    CascadeSelectModule,
    MultiSelectModule,
    InputTextareaModule,
    InputTextModule,
    RatingModule,
    ChipModule,
    KnobModule,
    ListboxModule,
    SelectButtonModule,
    CheckboxModule,
    InputSwitchModule,
    RadioButtonModule,
    ColorPickerModule,
    ToggleButtonModule,
    SliderModule,
    RippleModule,
    SplitButtonModule,
    AccordionModule,
    TabViewModule,
    FieldsetModule,
    MenuModule,
    DividerModule,
    SplitterModule,
    PanelModule,
    ToastModule,
    ProgressBarModule,
    TableModule,
    CalendarModule,
    FormsModule
  ]
})
export class PensionProcessModule { }
