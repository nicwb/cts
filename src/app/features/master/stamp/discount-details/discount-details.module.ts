import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountDetailsRoutingModule } from './discount-details-routing.module';
import { DiscountDetailsComponent } from './discount-details.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormGroup } from '@angular/forms';

@NgModule({
    declarations: [DiscountDetailsComponent],
    imports: [
        CommonModule,
        DropdownModule,
        DiscountDetailsRoutingModule,
        FormGroup
    ]
})
export class DiscountDetailsModule { }
