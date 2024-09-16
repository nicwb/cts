import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [StampCombinationDropdownModule],
    imports: [
        CommonModule,
        DropdownModule,
        FormsModule
    ],
    exports:[StampCombinationDropdownModule]
})
export class StampCombinationDropdownModule { }
