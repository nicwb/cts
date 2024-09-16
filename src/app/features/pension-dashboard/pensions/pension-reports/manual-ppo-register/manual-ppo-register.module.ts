import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ManualPpoRegisterComponent } from './manual-ppo-register.component';



const routes: Routes = [


    {path: '', component: ManualPpoRegisterComponent, data: { breadcrumb: 'ManualPpoRegisterComponent' }},

];



@NgModule({
    declarations: [ManualPpoRegisterComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        InputTextareaModule,
        OptionCardModule,
        CommonHeaderModule,
        DialogModule,
        CalendarModule,
        InputTextModule,
        CardModule,
        SelectButtonModule,
        PanelModule,
        FieldsetModule,
        RadioButtonModule
    ]
})
export class ManualPpoRegisterModule { }
