import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { StampRoutingModule } from './stamp-routing.module';
import { StampComponent } from './stamp.component';
import { LabelComponent } from './label/label.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { ButtonModule } from 'primeng/button';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { CategoryComponent } from './category/category.component';
import { TypeComponent } from './type/type.component';
import { VendorComponent } from './vendor/vendor.component';
import { DiscountDetailsComponent } from './discount-details/discount-details.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { VendorTypeDropdownComponent } from '../../../shared/modules/vendor-type-dropdown/vendor-type-dropdown.component';
import { StampCategoryTypeDropdownComponent } from 'src/app/shared/modules/stamp-category-type-dropdown/stamp-category-type-dropdown.component';
import { CombinationComponent } from './combination/combination.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    declarations: [
        StampComponent,
        LabelComponent,
        CategoryComponent,
        TypeComponent,
        VendorComponent,
        DiscountDetailsComponent,
        VendorTypeDropdownComponent,
        StampCategoryTypeDropdownComponent,
        CombinationComponent
    ],
    imports: [
        InputTextModule,
        DialogModule,
        CommonModule,
        StampRoutingModule,
        OptionCardModule,
        ButtonModule,
        CalendarModule,
        DropdownModule,
        CommonHeaderModule,
        DynamicTableModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPermissionsModule.forChild()

    ],
    providers: [DatePipe]
})
export class StampModule { }
