import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PensionDashboardComponent } from './pension-dashboard.component';


const routes: Routes = [
    { 
        path: '',
        component: PensionDashboardComponent,
        data: { breadcrumb: 'PensionDashboardComponent' }
    },
    {
        path: 'modules',
        loadChildren: () => import('./pensions/pensions.module').then(m => m.PensionsModule),
        data: { breadcrumb: 'PensionsModule' }
    },
    {
        path: 'modules/pension-process',
        loadChildren: () =>
            import('./pensions/pension-process/pension-process.module').then(m => m.PensionProcessModule),
        data: { breadcrumb: 'PensionProcessModule' }
    },
    {
        path: 'modules/pension-process/ppo',
        loadChildren: () => import('./pensions/pension-process/ppo/ppo.module').then(m => m.PpoModule),
        data: { breadcrumb: 'PpoModule' }
    },
    {
        path: 'modules/pension-process/ppo/entry',
        loadChildren: () => import('./pensions/pension-process/ppo/entry/entry.module').then(m => m.EntryModule),
        data: { breadcrumb: 'EntryModule' }
    },
  
    {
        path: 'modules/pension-process/ppo/manual-ppo-receipt',
        loadChildren: () =>
            import('./pensions/pension-process/ppo/manual-ppo-receipt/manual-ppo-receipt.module').then(m => m.ManualPpoReceiptModule),
        data: { breadcrumb: 'ManualPpoReceiptModule' }
    },
  
    {
        path: 'modules/pension-process/ppo/entry/sanction',
        loadChildren: () => import('./pensions/pension-process/ppo/entry/ppodetails/sanction/sanction.module').then(m => m.SanctionModule),
        data: { breadcrumb: 'SanctionModule' }
    },
    {
        path: 'modules/pension-process/ppo/entry/family-nominee',
        loadChildren: () =>
            import('./pensions/pension-process/ppo/entry/ppodetails/family-nominee/family-nominee.module').then(m => m.FamilyNomineeModule),
        data: { breadcrumb: 'FamilyNomineeModule' }
    },
    {
        path: 'modules/pension-process/pension-bill',
        loadChildren: () => import('./pensions/pension-process/pension-bill/pension-bill.module').then(m => m.PensionBillModule),
        data: { breadcrumb: 'PensionBillModule' }
    },
    {
        path: 'modules/pension-process/ppo/convert-to-family-pension',
        loadChildren: () => import('./pensions/pension-process/ppo/convert-to-family-pension/convert-to-family-pension.module').then(m => m.ConvertToFamilyPensionModule),
        data: { breadcrumb: 'ConvertToFamilyPensionModule' }
    },
    {
        path: 'modules/pension-process/ppo/life-certificate',
        loadChildren: () => import('./pensions/pension-process/ppo/life-certificate/life-certificate.module').then(m => m.LifeCertificateModule),
        data: { breadcrumb: 'LifeCertificateModule' }
    },
    {
        path: 'modules/pension-process/pensioner-details',
        loadChildren: () => import('./pensions/pension-process/pensioner-details/pensioner-details.module').then(m => m.PensionerDetailsModule),
        data: { breadcrumb: 'PensionerDetailsModule' }
    },
    {
        path : 'modules/pension-reports/manual-ppo-register',
        loadChildren: () => import('./pensions/pension-reports/manual-ppo-register/manual-ppo-register.module').then(m => m.ManualPpoRegisterModule),
        data: { breadcrumb: 'ManualPpoRegisterModule' }
    },
    {
        path: 'modules/pension-process/bill-print',
        loadChildren: () => import('./pensions/pension-process/bill-print/bill-print.module').then(m => m.BillPrintModule),
        data: { breadcrumb: 'BillPrintModule' }
    },
    {
        path: 'modules/pension-process/bill-print/regular-pension',
        loadChildren: () => import('./pensions/pension-process/bill-print/regular-pension/regular-pension.module').then(m => m.RegularPensionModule),
        data: { breadcrumb: 'RegularPensionModule' }
    },
    {
        path: 'modules/pension-process/bill-print/first-pension',
        loadChildren: () => import('./pensions/pension-process/bill-print/first-pension/first-pension.module').then(m => m.FirstPensionModule),
        data: { breadcrumb: 'FirstPensionModule' }
    },
    {
        path : 'master/pension/component-rate',
        loadChildren: () => import('src/app/features/master/pension/component-rate/component-rate.module').then(m => m.ComponentRateModule),
        data: { breadcrumb: 'ComponentRateModule' }
    
    },
    {
        path : 'modules/pension-process/approval',
        loadChildren: () => import('./pensions/pension-process/approval/approval.module').then(m => m.ApprovalModule),
        data: { breadcrumb: 'ApprovalModule' }
    },
    {
        path : 'modules/pension-process/approval/ppo-approval',
        loadChildren: () => import('./pensions/pension-process/approval/ppo-approval/ppo-approval.module').then(m => m.PpoApprovalModule),
        data: { breadcrumb: 'PpoApprovalModule' }
    }
   
  
  
  
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class PensionDashboardRoutingModule {}
