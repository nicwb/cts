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
import { CombinationComponent } from './combination/combination.component';
import { CalendarModule } from 'primeng/calendar';
import { StampCategoryTypeDropdownModule } from 'src/app/shared/modules/stamp-category-type-dropdown/stamp-category-type-dropdown.module';
import { VendorTypeDropdownModule } from 'src/app/shared/modules/vendor-type-dropdown/vendor-type-dropdown.module';
import { StampDenominationDropdownModule } from 'src/app/shared/modules/stamp-denomination-dropdown/stamp-denomination-dropdown.module';
import { StampLabelDropdownModule } from 'src/app/shared/modules/stamp-label-dropdown/stamp-label-dropdown.module';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';

@NgModule({
  declarations: [
    StampComponent,
    LabelComponent,
    CategoryComponent,
    TypeComponent,
    VendorComponent,
    DiscountDetailsComponent,
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
    MhPrimeDynamicTableModule,
    ReactiveFormsModule,
    FormsModule,
    StampCategoryTypeDropdownModule,
    VendorTypeDropdownModule,
    StampDenominationDropdownModule,
    TreasuryDropdownModule,
    StampLabelDropdownModule,
    NgxPermissionsModule.forChild(),

  ],
  providers: [DatePipe]
})
export class StampModule { }
