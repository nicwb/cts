import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';

import { PensionModule } from './pension/pension.module';


@NgModule({
    declarations: [MasterComponent],
    imports: [
        CommonModule,
        MasterRoutingModule,
        OptionCardModule,
        PensionModule
    ]
})
export class MasterModule { }
