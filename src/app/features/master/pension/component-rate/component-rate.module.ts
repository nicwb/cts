import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { ComponentRateComponent } from './component-rate.component';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext'; // Import InputTextModule
import { FieldsetModule } from 'primeng/fieldset'; // Import FieldsetModule
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';

const routes: Routes = [{ path: '', component: ComponentRateComponent }];

@NgModule({
    declarations: [ComponentRateComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule, // Add ReactiveFormsModule here
        ButtonModule,
        RadioButtonModule,
        InputTextModule, // Add InputTextModule here
        FieldsetModule, // Add FieldsetModule here
        CalendarModule,
        DropdownModule,
        PopupTableModule,
        RouterModule.forChild(routes),
    ],
    exports: [ComponentRateComponent],
    bootstrap: [ComponentRateComponent],
})
export class ComponentRateModule {}
