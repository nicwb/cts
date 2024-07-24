import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { StocksComponent } from './stocks/stocks.component';
import { TdsDetailsComponent } from './tds-details/tds-details.component';

const routes: Routes = [
  {path: '', component: ReportsComponent},
  {path: 'stocks', component: StocksComponent},
  {path: 'tds-details', loadChildren:()=>import("./tds-details/tds-details.module").then(m=>m.TdsDetailsModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
