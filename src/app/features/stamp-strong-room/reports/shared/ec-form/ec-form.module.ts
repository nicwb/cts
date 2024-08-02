import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcFormComponent } from './ec-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [EcFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule
  ],
  exports: [EcFormComponent]
})
export class EcFormModule { }
