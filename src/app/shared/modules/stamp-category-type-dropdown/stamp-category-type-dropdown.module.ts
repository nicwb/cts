import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
// import { StampCategoryTypeDropdownModule } from './stamp-category-type-dropdown.component';



@NgModule({
    declarations: [StampCategoryTypeDropdownModule],
    imports: [
        CommonModule,
        DropdownModule,
        FormsModule
    ],
    exports:[StampCategoryTypeDropdownModule]
})

export class StampCategoryTypeDropdownModule { }
