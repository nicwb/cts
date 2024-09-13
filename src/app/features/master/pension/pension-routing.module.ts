import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionComponent } from './pension.component';
import { ComponentComponent } from './component/component.component';
import { PrimaryComponent } from './primary/primary.component';
import { PensionCategoryComponent } from './pension-category/pension-category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';

const routes: Routes = [
    {
        path: 'component',
        component: ComponentComponent,
        data: { breadcrumb: 'ComponentComponent' }
    },
    {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentModule),
        data: { breadcrumb: 'ComponentModule' }
    },
    {
        path: '',
        component:PensionComponent,
        data: { breadcrumb: 'PensionComponent' }
    },
    {
        path: 'app-primary',
        component: PrimaryComponent,
        data: { breadcrumb: 'PrimaryComponent' }
    },
    {
        path: 'app-pension-category',
        component: PensionCategoryComponent,
        data: { breadcrumb: 'PensionCategoryComponent' }
    },
    {
        path: 'app-sub-category',
        component: SubCategoryComponent,
        data: { breadcrumb: 'SubCategoryComponent' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PensionRoutingModule {}
