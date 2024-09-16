import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeEntryRoutingModule } from './cheque-entry-routing.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { ChequeEntryComponent } from './cheque-entry.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { MicrModule } from 'src/app/shared/modules/micr/micr.module';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';




@NgModule({
    declarations: [ChequeEntryComponent],
    imports: [
        CommonModule,
        ChequeEntryRoutingModule,
        OptionCardModule,
        CommonHeaderModule,
        CardModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        DynamicTableModule,
        FormsModule,
        ReactiveFormsModule,
        MicrModule,
        DropdownModule,
        TreasuryDropdownModule,
        NgxPermissionsModule.forChild() 
    ]
})
export class ChequeEntryModule { }
