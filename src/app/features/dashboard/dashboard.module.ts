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
import { RouterModule, Routes } from '@angular/router';
import { AppConfigModule } from 'src/app/layout/config/config.module';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'primeng/api';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonModule } from '@angular/common';
// import { OpctionComponent } from './opction/opction.component';
import { PensionReportsModule } from '../pension-reports/pension-reports.module';
import { ToastModule } from 'primeng/toast';
import { AppLayoutComponent } from 'src/app/layout/app.layout.component';
import { DashboardComponent } from './dashboard.component';
@NgModule({
    declarations: [DashboardComponent],
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
        ToastModule,
        AppLayoutModule,
        // RouterModule.forChild(routes),
    ],
    exports: [DashboardComponent, RouterModule, AppLayoutComponent],
})
export class DashboardModule {}
