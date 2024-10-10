import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule, Routes } from '@angular/router';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppLayoutComponent } from "./app.layout.component";
import { LoadingIndeterminateComponent } from './loading-indeterminate/loading-indeterminate.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from '../shared/modules/shared.module';
import { AppSidebarPensionComponent } from './app.sidebar.pension/app.sidebar.pension.component';
import { OptionCardModule } from '../shared/modules/option-card/option-card.module';
import { CommonModule } from '@angular/common';
// import { OpctionComponent } from './opction/opction.component';
import { PensionReportsModule } from '../features/pension-reports/pension-reports.module';
import { ToastModule } from 'primeng/toast';
// const routes: Routes = [
// { path: '', component: AppLayoutComponent,
//     // children: [
//     //     {
//     //         path: 'master',
//     //         loadChildren: () => import('../features/master/master.module').then(m => m.MasterModule),
//     //         data: { breadcrumb: 'MasterModule' }
//     //     },
//     // ],
// }
// ];
@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
        BreadcrumbComponent,
        LoadingIndeterminateComponent,
        AppSidebarPensionComponent,
        // OpctionComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        ProgressBarModule,
        BreadcrumbModule,
        ButtonModule,
        AvatarModule,
        ConfirmDialogModule,
        SharedModule,
        OptionCardModule,
        PensionReportsModule,
        ToastModule
        // RouterModule.forChild(routes),
    ],
    exports: [AppLayoutComponent,RouterModule]
})
export class AppLayoutModule { }
