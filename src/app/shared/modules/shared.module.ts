import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterPipe } from 'src/app/core/pipe/first-letter.pipe';
import { NumberToWordsPipe } from 'src/app/core/pipe/number-to-words.pipe';
import { PensionerStatusComponent } from './pensioner-status/pensioner-status.component';

@NgModule({
    declarations: [
        FirstLetterPipe,
        NumberToWordsPipe,
    ],
    imports: [
        CommonModule
    ],
    exports:[
        FirstLetterPipe,
        NumberToWordsPipe
    ]
})
export class SharedModule { }
