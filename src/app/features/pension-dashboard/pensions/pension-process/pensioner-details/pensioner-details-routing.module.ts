import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionerDetailsComponent } from './pensioner-details.component';
import { RevisionofComponentsComponent } from './revisionof-components/revisionof-components.component';

const routes: Routes = [
    {path: '', component: PensionerDetailsComponent},
    {
      path: 'revision', 
      data: { breadcrumb: 'Revision Component' },
      component: RevisionofComponentsComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PensionerDetailsRoutingModule { }
