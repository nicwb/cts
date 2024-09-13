import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PensionDashboardRoutingModule } from './pension-dashboard-routing.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { PensionDashboardComponent } from './pension-dashboard.component';
import { PensionProcessModule } from './pensions/pension-process/pension-process.module';
import { RouterModule } from '@angular/router';





@NgModule({
    declarations: [PensionDashboardComponent],
    imports: [
        CommonModule,
        OptionCardModule,
        PensionDashboardRoutingModule,
        RouterModule.forChild([
            { path: '', component: PensionDashboardComponent, data: { breadcrumb: 'PensionDashboardComponent' } }
        ]),
        PensionProcessModule
    ]
})
export class PensionDashboardModule { }
