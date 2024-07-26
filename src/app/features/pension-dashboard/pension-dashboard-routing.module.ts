import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PensionDashboardComponent } from './pension-dashboard.component';


const routes: Routes = [
  { path: '', component: PensionDashboardComponent },
  {
    path: 'modules',
    loadChildren: () => import('./pensions/pensions.module').then(m => m.PensionsModule),
  },
  {
    path: 'modules/pension-process',
    loadChildren: () =>
      import('./pensions/pension-process/pension-process.module').then(m => m.PensionProcessModule),
  },
  {
    path: 'modules/pension-process/ppo',
    loadChildren: () => import('./pensions/pension-process/ppo/ppo.module').then(m => m.PpoModule),
  },
  {
    path: 'modules/pension-process/ppo/entry',
    loadChildren: () => import('./pensions/pension-process/ppo/entry/entry.module').then(m => m.EntryModule),
  },
  {
    path: 'modules/pension-process/ppo/entry/ppodetails',
    loadChildren: () =>
      import('./pensions/pension-process/ppo/entry/ppodetails/ppodetails.module').then(m => m.PpodetailsModule),
  },
  {
    path: 'modules/pension-process/ppo/manual-ppo-receipt',
    loadChildren: () =>
      import('./pensions/pension-process/ppo/manual-ppo-receipt/manual-ppo-receipt.module').then(m => m.ManualPpoReceiptModule),
  },
  {
    path: 'modules/pension-process/ppo/entry/sanction',
    loadChildren: () => import('./pensions/pension-process/ppo/entry/sanction/sanction.module').then(m => m.SanctionModule),
  },
  {
    path: 'modules/pension-process/ppo/entry/family-nominee',
    loadChildren: () =>
      import('./pensions/pension-process/ppo/entry/family-nominee/family-nominee.module').then(m => m.FamilyNomineeModule),
  },
  {
   path: 'modules/pension-process/pension-bill',
   loadChildren: () => import('./pensions/pension-process/pension-bill/pension-bill.module').then(m => m.PensionBillModule),
  },
  {
    path: 'modules/pension-process/ppo/convert-to-family-pension',
    loadChildren: () => import('./pensions/pension-process/ppo/convert-to-family-pension/convert-to-family-pension.module').then(m => m.ConvertToFamilyPensionModule),
   },
   {
    path: 'modules/pension-process/ppo/life-certificate',
    loadChildren: () => import('./pensions/pension-process/ppo/life-certificate/life-certificate.module').then(m => m.LifeCertificateModule),
   },
   {
    path: 'modules/pension-process/pensioner-details',
    loadChildren: () => import('./pensions/pension-process/pensioner-details/pensioner-details.module').then(m => m.PensionerDetailsModule),
   },
  
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
