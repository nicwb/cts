import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { CalendarModule } from 'primeng/calendar';
import { LifeCertificateComponent } from './life-certificate.component';
import { FieldsetModule } from 'primeng/fieldset';
import { PensionerStatusModule } from 'src/app/shared/modules/pensioner-status/pensioner-status.module';
import { DividerModule } from 'primeng/divider';
// import { PensionerStatusModule } from '../pensioner-status/pensioner-status.module';



const routes: Routes = [
    {path: '',component: LifeCertificateComponent}
];


@NgModule({
    declarations: [LifeCertificateComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CheckboxModule,
        SelectButtonModule,
        CardModule,
        InputTextModule,
        RadioButtonModule,
        ButtonModule,
        InputTextareaModule,
        DynamicTableModule,
        OptionCardModule,
        CommonHeaderModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        TreasuryDropdownModule,
        FieldsetModule,
        DividerModule,
        RouterModule.forChild(routes),
        PensionerStatusModule
    ],
    exports: [LifeCertificateComponent],
})




export class LifeCertificateModule { }