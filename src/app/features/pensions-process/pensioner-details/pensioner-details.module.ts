import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevisionofComponentsComponent } from './revisionof-components/revisionof-components.component';
import { RouterModule, Routes } from '@angular/router';
// import { FieldsetModule } from 'primeng/fieldset';
// import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { PensionerDetailsRoutingModule } from './pensioner-details-routing.module';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import {RevisionofComponentsModule} from './revisionof-components/revisionof-component.module'
import { SharedModule } from 'primeng/api';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PensionerDetailsComponent } from './pensioner-details.component';


@NgModule({
    declarations: [PensionerDetailsComponent],
    imports: [
        CommonModule,
        FieldsetModule,  //for panel module
        RadioButtonModule, //for radio button module
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
        InputTextModule,
        RevisionofComponentsModule,
        SharedModule,
        OptionCardModule,
        CardModule,
        RouterModule

    
    ],
    exports: [],
})
export class PensionerDetailsModule {}
