import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { PensionRoutingModule } from './pension-routing.module';
import { PensionComponent } from './pension.component';
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
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimaryComponent } from './primary/primary.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';

import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { PensionCategoryComponent } from './pension-category/pension-category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { AutoCompleteModule } from "primeng/autocomplete";
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { ColorPickerModule } from 'primeng/colorpicker';

const routes: Routes = [
  {path: "",component:PensionComponent},
  {path: "pension",component:PensionComponent},
];
@NgModule({
  declarations: [PensionComponent,PrimaryComponent, PensionCategoryComponent,SubCategoryComponent],
  imports: [
    CommonModule,
    PensionRoutingModule,
    OptionCardModule,
    RouterModule.forChild(routes),
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
    AutoCompleteModule,
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
    RadioButtonModule,
    ColorPickerModule,

  ],
  exports: [PensionComponent],
  bootstrap: [PensionComponent]
})
export class PensionModule { }
