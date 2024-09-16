import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DropdownModule } from 'primeng/dropdow
// import { FormsModule } from '@angular/forms';
import { VendorTypeDropdownComponent } from './vendor-type-dropdown.component';



@NgModule({
    declarations: [VendorTypeDropdownComponent],
    imports: [
        CommonModule,
    // DropdownModule,
    // FormsModule
    ],
    exports:[VendorTypeDropdownComponent]
})
export class VendorTypeDropdownModule { }
