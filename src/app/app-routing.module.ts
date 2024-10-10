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
                        path: 'master',
                        loadChildren: () => import('./features/master/master.module').then(m => m.MasterModule),
                        data: { breadcrumb: 'MasterModule' }
                    },
                    {
                        path: 'pension-process',
                        loadChildren: () => import('./features/pensions-process/pensions-process.module').then(m => m.PensionsProcessModule),
                        data: {breadcrumb: 'PensionsProcessModule'}
                    },
                    {
                        path: 'pension-report',
                        loadChildren: () => import('./features/pension-reports/pension-reports.module').then(m => m.PensionReportsModule),
                        data: {breadcrumb: 'PensionReportsModule'}
                    },
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
