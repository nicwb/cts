import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderComponent } from './common-header.component';
import { ButtonModule } from 'primeng/button';





@NgModule({
    declarations: [CommonHeaderComponent],
    imports: [
        CommonModule,
        ButtonModule
    ],
    exports:[
        CommonHeaderComponent
    ]
})
export class CommonHeaderModule { }
