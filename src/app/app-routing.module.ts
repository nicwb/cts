import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
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
                    // { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: '', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'bill-receive', canActivate: [NgxPermissionsGuard],data: {permissions: {only: 'can-receive-bill',redirectTo: '/notfound'}}, loadChildren: () => import('./features/bill-receive/bill-receive.module').then(m => m.BillReceiveModule) },
                    { path: 'token', loadChildren: () => import('./features/token/token.module').then(m => m.TokenModule) },
                    { path: 'option', loadChildren: () => import('./features/options/options.module').then(m => m.OptionsModule) },
                    {path:'bill-checking', canActivate: [NgxPermissionsGuard],data: {permissions: {only: 'can-bill-check',redirectTo: '/notfound'}},loadChildren: () => import('./features/bill-checking/bill-checking.module').then(m => m.BillCheckingModule)},
                    {path:'return-memo',canActivate: [NgxPermissionsGuard],data: {permissions: {only: 'can-generate-return-memo',redirectTo: '/notfound'}},loadChildren: () => import('./features/return-memo/return-memo.module').then(m => m.ReturnMemoModule)},
                    {path:'payment-mandate',loadChildren:()=>import('./features/payment-mandate/payment-mandate.module').then(m=>m.PaymentMandateModule)},
                    {path:'cheque',loadChildren: () => import('./features/cheque/cheque.module').then(m => m.ChequeModule)},
                    {path:'master',loadChildren: () => import('./features/master/master.module').then(m => m.MasterModule)},
                    {path:'stamp-strong-room', data: {Breadcrumb: 'stamp-strong-room'}, loadChildren: () => import('./features/stamp-strong-room/stamp-strong-room.module').then(m => m.StampStrongRoomModule)},

                ]
            },
            {path:'login',component:LoginComponent},
            {path:'static-login',component:StaticLoginComponent},
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotFoundComponent },
            { path: 'server-down', component: ServerDownComponent },
            // { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
