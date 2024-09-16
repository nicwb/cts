import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampComponent } from './stamp.component';
import { LabelComponent } from './label/label.component';
import { CategoryComponent } from './category/category.component';
import { TypeComponent } from './type/type.component';
import { VendorComponent } from './vendor/vendor.component';
import { DiscountDetailsComponent } from './discount-details/discount-details.component';
import { CombinationComponent } from './combination/combination.component';

const routes: Routes = [{ path: '', component: StampComponent },
    { path: 'label', component: LabelComponent },
    { path: 'category', component: CategoryComponent }, { path: 'type', component: TypeComponent },
    { path: 'vendor', component: VendorComponent }, { path: 'discount-details', component: DiscountDetailsComponent },
    { path: 'combination', component: CombinationComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StampRoutingModule { }
