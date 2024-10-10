// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MasterRoutingModule } from './master-routing.module';
// import { MasterComponent } from './master.component';
// import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';

// @NgModule({
//     declarations: [MasterComponent],  // Declare only components that belong here
//     imports: [
//         CommonModule,
//         MasterRoutingModule,
//         OptionCardModule
//     ]
// })
// export class MasterModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { ComponentModule } from './component/component.module';
import { PrimaryModule } from './primary/primary.module';
import { ComponentRateRevisionsModule } from './component-rate-revisions/component-rate-revisions.module';
import { ComponentRateModule } from './component-rate/component-rate.module';
import { PensionCategoryModule } from './pension-category/pension-category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';

@NgModule({
    declarations: [MasterComponent],  // Declare components specific to this module
    imports: [
        CommonModule,
        MasterRoutingModule,
        OptionCardModule,
        ComponentModule,
        PrimaryModule,
        SubCategoryModule,
        PensionCategoryModule,
        ComponentRateRevisionsModule,
        ComponentRateModule
    ],
    exports: [MasterComponent] // Export if needed in other modules
})
export class MasterModule { }
