import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpoApprovalComponent } from './ppo-approval.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {
        path: '',
        component: PpoApprovalComponent // Use empty path for default route
    }
];
@NgModule({
    declarations: [PpoApprovalComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FieldsetModule,
        PopupTableModule,
        DialogModule,
        ToggleButtonModule,
        ButtonModule,
        RouterModule,
        RouterModule.forChild(routes) // Lazy loading routes

    ],
    exports:[
        PpoApprovalComponent
    ]

})
export class PpoApprovalModule { }
