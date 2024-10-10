import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PensionsProcessComponent } from './pensions-process.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PensionsProcessRoutingModule } from './pensions-process-routing.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { ApprovalModule } from './approval/approval.module';
import { PensionerDetailsModule } from './pensioner-details/pensioner-details.module';
import { PensionBillModule } from './pension-bill/pension-bill.module';


@NgModule({
    declarations: [
        PensionsProcessComponent,
        // No BillPrintComponent here
    ],
    imports: [
        CommonModule,
        ButtonModule,
        PensionsProcessRoutingModule,
        DynamicTableModule,
        OptionCardModule,
        CommonHeaderModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        ReactiveFormsModule,
        TreasuryDropdownModule,
        FormsModule,
        ApprovalModule,
        PensionerDetailsModule,
        // PensionBillModule,
    ]
})
export class PensionsProcessModule { }
