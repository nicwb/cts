import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionsComponent } from './pensions.component';
import { PensionProcessComponent } from './pension-process/pension-process.component';
import { PensionReportsComponent } from './pension-reports/pension-reports.component';

const routes: Routes = [
    {path: '', component: PensionsComponent, data: { breadcrumb: 'PensionsComponent' }},
    {path: 'pension-process', component: PensionProcessComponent, data: { breadcrumb: 'PensionProcessComponent' }},
    {path: 'pension-reports', component: PensionReportsComponent, data: { breadcrumb: 'PensionReportsComponent' }},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionsRoutingModule { }
