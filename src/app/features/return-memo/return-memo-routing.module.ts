import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnMemoComponent } from './return-memo.component';
import { GenerateReturnMemoComponent } from './generate-return-memo/generate-return-memo.component';

const routes: Routes = [
    {path:"",component:ReturnMemoComponent},
    {path:"generate",component:GenerateReturnMemoComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReturnMemoRoutingModule { }
