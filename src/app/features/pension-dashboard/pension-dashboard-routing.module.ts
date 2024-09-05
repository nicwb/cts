import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PensionDashboardComponent } from './pension-dashboard.component';


const routes: Routes = [
  { path: '', component: PensionDashboardComponent },
  {
    path: 'modules',
    data: { breadcrumb: 'Pension' },
    loadChildren: () => import('./pensions/pensions.module').then(m => m.PensionsModule),
  },
  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class PensionDashboardRoutingModule {}
