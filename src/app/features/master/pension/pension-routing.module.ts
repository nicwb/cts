import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionComponent } from './pension.component';
import { ComponentComponent } from './component/component.component';
import { PrimaryComponent } from './primary/primary.component';
import { PensionCategoryComponent } from './pension-category/pension-category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';

const routes: Routes = [
  {path: '', component:PensionComponent},
  {
    path: 'component',
    data: { breadcrumb: 'Component' },
    loadChildren: () => import('./component/component.module').then(m => m.ComponentModule)
  },
  { 
    path: 'app-primary', 
    data: { breadcrumb: 'Primary' },
    component: PrimaryComponent 
  },
  { 
    path: 'app-pension-category',
    data: { breadcrumb: 'Pension Category' },
    component: PensionCategoryComponent 
  },
  { 
    path: 'app-sub-category',
    data: { breadcrumb: 'Sub Category' },
    component: SubCategoryComponent 
  },
  {
    path : 'component-rate',
    data: { breadcrumb: 'Component Rate' },

    loadChildren: () => import('src/app/features/master/pension/component-rate/component-rate.module').then(m => m.ComponentRateModule),

  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PensionRoutingModule {}
