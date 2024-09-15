import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { OptionCardModule} from 'src/app/shared/modules/option-card/option-card.module';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { PensionBillComponent } from './pension-bill.component';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { DividerModule } from 'primeng/divider';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from "primeng/chip";
import { ColorPickerModule } from 'primeng/colorpicker';
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
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { FirstPensionPensionBillComponent } from './first-pension-pension-bill/first-pension-pension-bill.component';
import { RegularPensionPensionBillComponent } from './regular-pension-pension-bill/regular-pension-pension-bill.component';

const routes: Routes = [
    { path: '', component: PensionBillComponent, data: { breadcrumb: 'PensionBillComponent' }},
    { path: 'regular-pension-pension-bill', component: RegularPensionPensionBillComponent, data: { breadcrumb: 'RegularPensionComponent' }},
    { path: 'first-pension-pension-bill', component: FirstPensionPensionBillComponent, data: { breadcrumb: 'FirstPensionComponent' }},
]
  @NgModule({
      declarations: [
          PensionBillComponent,
          FirstPensionPensionBillComponent,
          RegularPensionPensionBillComponent,

      ],
      imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          HttpClientModule,
          RouterModule,
          ButtonModule,
          DropdownModule,
          ChipsModule,
          ToastModule,
          RatingModule,
          TableModule,
          DialogModule,
          CalendarModule,
          PopupTableModule,
          DividerModule,
          OptionCardModule,
          RouterModule.forChild(routes),
          AccordionModule,
          AutoCompleteModule,
          CascadeSelectModule,
          CheckboxModule,
          ChipModule,
          ColorPickerModule,
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
          RippleModule,
          SelectButtonModule,
          SliderModule,
          SplitButtonModule,
          SplitterModule,
          TabViewModule,
          ToggleButtonModule,
          CommonHeaderModule,
          DynamicTableModule,
          MhPrimeDynamicTableModule,
          TreasuryDropdownModule

      ],
      providers: [MessageService],
    
      exports: [RouterModule],
  })
export class PensionBillModule { }
