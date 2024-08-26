import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpoApprovalComponent } from './ppo-approval/ppo-approval.component';
import { ApprovalComponent } from './approval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SearchPopupTempModule } from 'src/app/core/searchpopup/search-popup.module';

const routes: Routes = [


  {path: '', component: ApprovalComponent},
  {path: 'ppo-approval', component: PpoApprovalComponent}

];



@NgModule({
  declarations: [
    PpoApprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextareaModule,
    OptionCardModule,
    CommonHeaderModule,
    DialogModule,
    CalendarModule,
    InputTextModule,
    CardModule,
    SelectButtonModule,
    PanelModule,
    FieldsetModule,
    RadioButtonModule,
    SearchPopupTempModule,
    RouterModule.forChild(routes),
  ]
})
export class ApprovalModule { }
