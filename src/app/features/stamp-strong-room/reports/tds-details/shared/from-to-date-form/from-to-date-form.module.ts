import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FromToDateFormComponent } from './from-to-date-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FromToDateFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ], 
  exports: [FromToDateFormComponent]
})
export class FromToDateFormModule { }
