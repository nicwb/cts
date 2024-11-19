
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PensionBillComponent} from './pension-bill.component';
import {FirstPensionBillModule} from './first-pension-bill/first-pension-bill.module'
import { first } from 'rxjs';
import { RouterModule, Routes } from '@angular/router';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { FirstPensionBillComponent } from './first-pension-bill/first-pension-bill.component';
import { RegularPensionBillComponent } from './regular-pension-bill/regular-pension-bill.component';
import { RegularPensionBillModule } from './regular-pension-bill/regular-pension-bill.module';
import { LifeTimeArrearPensionBillComponent } from './life-time-arrear-pension-bill/life-time-arrear-pension-bill.component';
import { LifeTimeArrearPensionBillModule } from './life-time-arrear-pension-bill/life-time-arrear-pension-bill.module';

type NewType = Routes;

const routes: NewType = [
    {path:'',component:PensionBillComponent,data: { breadcrumb: 'PensionBillComponent' },
    },
    {
        path: 'first-pension-bill',
        component: FirstPensionBillComponent,
        data: { breadcrumb: 'FirstPensionBillComponent' },

    },
    {
        path: 'regular-pension-bill',
        component: RegularPensionBillComponent,
        data: { breadcrumb: 'RegularPensionBillComponent'}
    },
    {
        path: 'life-time-arrear-pension-bill',
        component: LifeTimeArrearPensionBillComponent,
        data: { breadcrumb: 'LifeTimeArrearPensionBillComponent'}
    }
];
@NgModule({
    declarations: [PensionBillComponent],  // Declare components specific to this module
    imports: [
        CommonModule,
        OptionCardModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CalendarModule,
        DialogModule,
        DropdownModule,
        CommonHeaderModule,
        DynamicTableModule,
        TreasuryDropdownModule,
        RegularPensionBillModule,
        FirstPensionBillModule,
        LifeTimeArrearPensionBillModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule] // Export if needed in other modules
})
export class PensionBillModule { }
