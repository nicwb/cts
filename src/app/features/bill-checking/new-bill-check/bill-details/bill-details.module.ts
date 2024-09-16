import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';



@NgModule({
    declarations: [],
    exports:[RouterModule],
    imports: [
        CommonModule,
        TableModule
    ]
})
export class BillDetailsModule { }
