import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PensionCategoryComponent } from './pension-category/pension-category.component';
import { PensionBankBranchComponent } from './pension-bank-branch/pension-bank-branch.component';
import { PensionDashboardComponent } from '../pension-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { PensionsComponent } from './pensions.component';
import { PensionProcessComponent } from './pension-process/pension-process.component';
import { PensionReportsComponent } from './pension-reports/pension-reports.component';
import { PensionQueryComponent } from './pension-query/pension-query.component';
import { PensionProcessModule } from './pension-process/pension-process.module';

const routes: Routes = [{path: '', component: PensionsComponent},
  {
    path: 'pension-process', 
    data: { breadcrumb: 'Pension Process' }, 
    component: PensionProcessComponent
  },
  {
    path: 'pension-reports', 
    data: { breadcrumb: 'Pension Reports' }, 
    component: PensionReportsComponent
  },
  {
    path: 'pension-query', 
    data: { breadcrumb: 'Pension Query' }, 
    component: PensionQueryComponent
  },
  
];

@NgModule({
  imports: [PensionProcessModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PensionsRoutingModule { }
