import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConvartToFamilyPensionComponent} from './convert-to-family-pension.component'
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ConvartToFamilyPensionComponent],
    imports: [
        CommonModule,
        DividerModule,
        InputTextareaModule,
        FieldsetModule,
        InputTextModule,
        TableModule,
        FormsModule,
        DropdownModule,
        CalendarModule,
        ReactiveFormsModule

    ]
})
export class ConvartToFamilyPensionModule { }
