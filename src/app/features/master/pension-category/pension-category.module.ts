import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PensionCategoryRoutingModule } from './pension-category-routing.module';
import { PensionCategoryComponent } from './pension-category.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';  // <-- Import this for ngModel
import { DialogModule } from 'primeng/dialog';  // <-- Import DialogModule
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [PensionCategoryComponent],
    imports: [
        CommonModule,
        PensionCategoryRoutingModule,
        DropdownModule,
        FormsModule,
        DialogModule,
        CommonHeaderModule,
        MhPrimeDynamicTableModule,
        ButtonModule
    ],
    exports: [PensionCategoryComponent]
})
export class PensionCategoryModule { }
