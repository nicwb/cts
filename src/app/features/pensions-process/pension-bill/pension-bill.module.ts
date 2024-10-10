
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PensionBillComponent} from './pension-bill.component';
import {FirstPensionBillModule} from './first-pension-bill/first-pension-bill.module'
import { first } from 'rxjs';
import { RouterModule, Routes } from '@angular/router';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { FirstPensionBillComponent } from './first-pension-bill/first-pension-bill.component';
import { RegularPensionBillComponent } from './regular-pension-bill/regular-pension-bill.component';
import { RegularPensionBillModule } from './regular-pension-bill/regular-pension-bill.module';

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
    }
];
@NgModule({
    declarations: [PensionBillComponent],  // Declare components specific to this module
    imports: [
        CommonModule,
        OptionCardModule,
        RegularPensionBillModule,
        FirstPensionBillModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule] // Export if needed in other modules
})
export class PensionBillModule { }
