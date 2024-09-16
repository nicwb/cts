import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TokenListComponent } from './token-list.component';
import {CalendarModule} from 'primeng/calendar';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {RatingModule} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';

@NgModule({
    declarations: [TokenListComponent],
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TableModule,
        CalendarModule,
        DataViewModule,
        DropdownModule,
        RatingModule,
        FormsModule,
        InputTextModule,
        PaginatorModule
    ],
    exports:[
        TokenListComponent
    ]
})
export class TokenListModule { }
