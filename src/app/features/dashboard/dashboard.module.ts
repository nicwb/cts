import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { ButtonModule } from 'primeng/button';
import { DashboardComponent } from './dashboard.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        OptionCardModule,
        ButtonModule,
        NgxPermissionsModule.forChild()
    ]
})
export class DashboardModule { }
