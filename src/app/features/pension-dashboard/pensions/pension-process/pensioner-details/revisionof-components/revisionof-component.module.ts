import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevisionofComponentsComponent } from './revisionof-components.component';
import { RouterModule, Routes } from '@angular/router';
// import { FieldsetModule } from 'primeng/fieldset';
// import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { PensionerDetailsRoutingModule } from '../pensioner-details-routing.module';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';



@NgModule({
    declarations: [RevisionofComponentsComponent],
    imports: [
        CommonModule,
        // FieldsetModule,  //for panel module
        // RadioButtonModule, //for radio button module
        FormsModule, //for form module
        ReactiveFormsModule,
        ButtonModule,
        PopupTableModule,
        SelectButtonModule,
        PensionerDetailsRoutingModule,
        TableModule,
        DividerModule,
        DialogModule,
        CalendarModule,
        InputTextModule

    
    ],
    exports: [],
})
export class RevisionofComponentsModule {}
