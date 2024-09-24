import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext'; // Import InputTextModule
import { FieldsetModule } from 'primeng/fieldset'; // Import FieldsetModule
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { TableModule } from 'primeng/table';
import { ComponentRateComponent } from '../component-rate/component-rate.component';
import { ComponentRateRevisionsComponent } from './component-rate-revisions.component';

const routes: Routes = [
    {
        path: '',
        component: ComponentRateRevisionsComponent,
        data: { breadcrumb: 'ComponentRateRevisionsComponent' }
    },
    {
        path: 'component-rate',
        component: ComponentRateComponent,
        data: { breadcrumb: 'ComponentRateComponent' }
    },
    {
        path: '**',
        redirectTo: ''
    }
];


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule, 
        ButtonModule,
        RadioButtonModule,
        InputTextModule,
        FieldsetModule, 
        CalendarModule,
        DropdownModule,
        PopupTableModule,
        TableModule,  
        RouterModule.forChild(routes),
    ],
    exports: [ComponentRateRevisionsModule],
})
export class ComponentRateRevisionsModule { }
