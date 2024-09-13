import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionerDetailsComponent } from './pensioner-details.component';
import { RevisionofComponentsComponent } from './revisionof-components/revisionof-components.component';

const routes: Routes = [
    {path: '', component: PensionerDetailsComponent, data: { breadcrumb: 'PensionerDetailsComponent' }},
    {path: 'revision', component: RevisionofComponentsComponent, data: { breadcrumb: 'RevisionofComponentsComponent' }}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionerDetailsRoutingModule { }
