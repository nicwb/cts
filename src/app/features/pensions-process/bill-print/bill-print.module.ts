import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillPrintComponent } from './bill-print.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { RouterModule, Routes } from '@angular/router';
import { Breadcrumb, BreadcrumbModule } from 'primeng/breadcrumb';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { FirstPensionBillPrintComponent } from './first-pension-bill-print/first-pension-bill.print.component';
import { FirstPensionBillPrintModule } from './first-pension-bill-print/first-pension-bill-print.module';
import { RegularPensionBillComponent } from '../pension-bill/regular-pension-bill/regular-pension-bill.component';
import { RegularPensionBillPrintComponent } from './regular-pension-bill-print/regular-pension-bill-print.component';
import { RegularPensionBillPrintModule } from './regular-pension-bill-print/regular-pension-bill-print.module';

const routes: Routes = [
    {
        path: '',
        component: BillPrintComponent,
        data: { breadcrumb: 'BillPrintComponent' }
    },
    {
        path: 'first-pension-bill-print', component: FirstPensionBillPrintComponent, data : {breadcrumb: 'FirstPensionBillPrintComponent'}
    },
    {
        path: 'regular-pension-bill-print', component: RegularPensionBillPrintComponent, data: {breadcrumb : 'RegularPensionBillPrintComponent'}
    }
];

@NgModule({
    declarations: [BillPrintComponent],  // Declare BillPrintComponent here only
    imports: [
        CommonModule,
        OptionCardModule,
        RouterModule.forChild(routes),
        DialogModule,
        DynamicDialogModule,
        BreadcrumbModule,
        FirstPensionBillPrintModule,
        RegularPensionBillPrintModule
    ],
    providers: [DialogService],
    exports: [RouterModule, BillPrintComponent]
})
export class BillPrintModule { }
