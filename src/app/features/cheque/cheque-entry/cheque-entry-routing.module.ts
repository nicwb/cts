import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeEntryComponent } from './cheque-entry.component';

const routes: Routes = [
    {path:"", component:ChequeEntryComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChequeEntryRoutingModule { }
