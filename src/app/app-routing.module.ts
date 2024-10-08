import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { ServerDownComponent } from './shared/components/server-down/server-down.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/guard/auth.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { StaticLoginComponent } from './features/static-login/static-login.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./features/pension-dashboard/pensions/pensions.module').then(m => m.PensionsModule),
                        data: { breadcrumb: 'PensionsModule' }
                    },
                    {
                        path:'master',
                        loadChildren: () => import('./features/master/master.module').then(m => m.MasterModule),
                        data: { breadcrumb: 'MasterModule' }
                    },
                    {
                        path:'pension',
                        loadChildren: () => import('./features/pension-dashboard/pension-dashboard.module').then(m => m.PensionDashboardModule),
                        data: { breadcrumb: 'PensionDashboardModule' }
                    },
                    {
                        path:'master/app-pension/component-rate',
                        loadChildren: () => import('src/app/features/master/pension/component-rate/component-rate.module').then(m => m.ComponentRateModule),
                        data: { breadcrumb: 'ComponentRateModule' }
                    }

                ],
                data: { breadcrumb: 'CTS AppLayoutComponent' }
            },
            {path:'login',component:LoginComponent, data: { breadcrumb: 'LoginComponent' }},
            {path:'static-login',component:StaticLoginComponent, data: { breadcrumb: 'StaticLoginComponent' }},
            { path: 'notfound', component: NotFoundComponent },
            { path: 'server-down', component: ServerDownComponent },
            // { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
