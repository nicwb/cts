import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampStrongRoomComponent } from './stamp-strong-room.component';

const routes: Routes = [{path: '', component: StampStrongRoomComponent},
{path: 'stamps', data: {Breadcrumb: ''}, loadChildren: () => import('./stamps/stamps.module').then(m => m.StampsModule)},
{path: 'stamp-management', data: {Breadcrumb: ''}, loadChildren: () => import('./stamp-management/stamp-management.module').then(m => m.StampManagementModule)},
{path: 'reports', data: {Breadcrumb: ''}, loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StampStrongRoomRoutingModule { }
