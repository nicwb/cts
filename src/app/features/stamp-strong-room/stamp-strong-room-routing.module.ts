import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampStrongRoomComponent } from './stamp-strong-room.component';
import { StampsComponent } from './stamps/stamps.component';

const routes: Routes = [{path: '', component: StampStrongRoomComponent},
    {path: 'stamps', loadChildren: () => import('./stamps/stamps.module').then(m => m.StampsModule)}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StampStrongRoomRoutingModule { }
