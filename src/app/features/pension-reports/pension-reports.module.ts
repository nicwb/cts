import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualPpoRegisterComponent } from './manual-ppo-register/manual-ppo-register.component';
import { PensionReportsComponent } from './pension-reports.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { ManualPpoRegisterModule } from './manual-ppo-register/manual-ppo-register.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', component: PensionReportsComponent, data: { breadcrumb: 'Pensionreport' }},
    {
        path: 'manual-ppo-register', // This loads the ApprovalModule lazily
        component: ManualPpoRegisterComponent,
        data: { breadcrumb: 'ManualPpoRegisterModule' }
    },
];
@NgModule({
    declarations: [
        PensionReportsComponent
    ],
    imports: [
        CommonModule,
        OptionCardModule,
        ManualPpoRegisterModule,
        RouterModule.forChild(routes),

    ],
    exports: [
        PensionReportsComponent,
        RouterModule
    ]
})
export class PensionReportsModule { }
