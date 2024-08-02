import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampStockRegisterComponent } from './stamp-stock-register/stamp-stock-register.component';
import { StocksComponent } from './stocks.component';

const routes: Routes = [
  {path: '', component: StocksComponent},
  {path: 'stamp-stock-register', component: StampStockRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StocksRoutingModule { }
