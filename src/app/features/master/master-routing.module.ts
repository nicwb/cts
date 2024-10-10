import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { PensionCategoryComponent } from './pension-category/pension-category.component';
import { ComponentComponent } from './component/component.component';
import { PrimaryComponent } from './primary/primary.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { ComponentRateComponent } from './component-rate/component-rate.component';
import { ComponentRateRevisionsComponent } from './component-rate-revisions/component-rate-revisions.component';

const routes: Routes = [
    {path:'',component:MasterComponent,data: { breadcrumb: 'MasterComponent' },
    },
    {
        path: 'pension-category',
        component: PensionCategoryComponent,  // Directly load the PensionCategoryComponent
        data: { breadcrumb: 'PensionCategoryComponent' },
    },
    {
        path: 'pension-category/new',
        component: PensionCategoryComponent,  // Reuse PensionCategoryComponent for 'new'
        data: { breadcrumb: 'PensionCategoryComponent' },
    },
    {
        path: 'component',
        component: ComponentComponent,
        data: { breadcrumb: 'ComponentComponent' },
    },
    {
        path: 'component/new',
        component: ComponentComponent,
        data: { breadcrumb: 'ComponentComponent' },
    },
    {
        path: 'primary',
        component: PrimaryComponent,
        data: { breadcrumb: 'PrimaryComponent' },
    },
    {
        path: 'primary/new',
        component: PrimaryComponent,
        data: { breadcrumb: 'PrimaryComponent' },
    },
    {
        path: 'sub-category',
        component: SubCategoryComponent,
        data: { breadcrumb: 'Sub Category' },
    },
    {
        path: 'sub-category/new',
        component: SubCategoryComponent,
        data: { breadcrumb: 'SubCategoryComponent' },
    },
    {
        path: 'component-rate',
        component: ComponentRateComponent,
        data: { breadcrumb: 'ComponentRateComponent' },
    },
    {
        path: 'component-rate-revision',
        component: ComponentRateRevisionsComponent,
        data: { breadcrumb: 'ComponentRateRevisionsComponent' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule] // Export RouterModule for use in MasterModule
})
export class MasterRoutingModule { }
