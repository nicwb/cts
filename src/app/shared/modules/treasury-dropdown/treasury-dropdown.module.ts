import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TreasuryDropdownComponent } from './treasury-dropdown.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [TreasuryDropdownComponent],
    imports: [
        CommonModule,
        DropdownModule,
        FormsModule
    ],
    exports:[TreasuryDropdownComponent]
})
export class TreasuryDropdownModule { }
