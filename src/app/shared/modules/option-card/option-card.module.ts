import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionCardComponent } from './option-card.component';



@NgModule({
    declarations: [OptionCardComponent],
    imports: [
        CommonModule
    ],
    exports:[
        OptionCardComponent
    ]
})
export class OptionCardModule { }
