import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { PensionComponent } from './pension/pension.component';


const routes: Routes = [
  {path: '', component: MasterComponent},
  {
    path: 'stamp',
    data: { breadcrumb: 'Stamp' },
    loadChildren: () => import('./stamp/stamp.module').then(m => m.StampModule)
  },
  {
    path: 'pension',
    data: { breadcrumb: 'Pension' },
    loadChildren: () => import('./pension/pension.module').then(m => m.PensionModule)
  },
  {
    path: 'app-pension', 
    loadChildren: () => import('./pension/pension.module').then(m => m.PensionModule)
  },
  
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
