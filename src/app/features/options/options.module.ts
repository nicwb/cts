import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
    declarations: [OptionsComponent],
    imports: [
        CommonModule,
        OptionsRoutingModule,
        OptionCardModule,
        NgxPermissionsModule.forChild()
    ]
})
export class OptionsModule { }
