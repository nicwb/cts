import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MicrComponent } from './micr.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [MicrComponent],
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports:[MicrComponent]
})
export class MicrModule { }
