import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StampCombinationDropdownForRequisitionsComponent } from './stamp-combination-dropdown-for-requisitions.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [StampCombinationDropdownForRequisitionsComponent],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  exports: [StampCombinationDropdownForRequisitionsComponent]
})
export class StampCombinationDropdownForRequisitionsModule { }
