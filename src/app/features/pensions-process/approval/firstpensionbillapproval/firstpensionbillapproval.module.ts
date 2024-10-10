import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FirstpensionbillapprovalComponent} from './firstpensionbillapproval.component'
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { DividerModule } from 'primeng/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
    {
        path: '',
        component: FirstpensionbillapprovalComponent // Use empty path for default route
    }
];
@NgModule({
    declarations: [
        FirstpensionbillapprovalComponent
    ],
    imports: [
        CommonModule,
        PopupTableModule,
        DividerModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        RouterModule.forChild(routes)
    ],
    exports:[
        FirstpensionbillapprovalComponent,
        RouterModule
    ]
})
export class FirstpensionbillapprovalModule { }
