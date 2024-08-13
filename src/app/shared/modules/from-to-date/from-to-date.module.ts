import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FromToDateComponent } from './from-to-date.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [FromToDateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule
  ],
  exports: [FromToDateComponent]
})
export class FromToDateModule { }
