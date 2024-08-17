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
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { RegularPensionComponent } from './regular-pension/regular-pension.component';
import { RouterModule, Routes } from '@angular/router';
import { BillPrintComponent } from './bill-print.component';
import { FirstPensionComponent } from './first-pension/first-pension.component';

const routes: Routes = [


  {path: '', component: BillPrintComponent},
  {path: 'regular-pension', component: RegularPensionComponent},
  { path: 'first-pension', component: FirstPensionComponent }

];



@NgModule({
  declarations: [
    RegularPensionComponent,
    FirstPensionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    AccordionModule,
    AutoCompleteModule,
    CalendarModule,
    CascadeSelectModule,
    CheckboxModule,
    ChipModule,
    ChipsModule,
    ColorPickerModule,
    DialogModule,
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
    MenuModule,
    MultiSelectModule,
    PanelModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    SelectButtonModule,
    SliderModule,
    SplitButtonModule,
    SplitterModule,
    TableModule,
    TabViewModule,
    ToastModule,
    ToggleButtonModule,
    CommonHeaderModule,
    DynamicTableModule,
    OptionCardModule,
    MhPrimeDynamicTableModule,
    RouterModule.forChild(routes),
  ]
})
export class BillPrintModule { }
