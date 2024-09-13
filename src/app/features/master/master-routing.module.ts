import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { PensionComponent } from './pension/pension.component';


const routes: Routes = [
    {
        path: '',
        component: MasterComponent,
        data: { breadcrumb: 'MasterComponent' }
    },
    {
        path: 'stamp',
        loadChildren: () => import('./stamp/stamp.module').then(m => m.StampModule),
        data: { breadcrumb: 'StampModule' }
        
    },
    {
        path: 'pension',
        loadChildren: () => import('./pension/pension.module').then(m => m.PensionModule),
        data: { breadcrumb: 'PensionModule' }
    },
    {
        path: 'app-pension',
        component: PensionComponent,
        data: { breadcrumb: 'PensionComponent' }
    }, 
    {
        path: 'app-pension',
        loadChildren: () => import('./pension/pension.module').then(m => m.PensionModule),
        data: { breadcrumb: 'PensionModule' }
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterRoutingModule { }
