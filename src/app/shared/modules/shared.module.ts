import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterPipe } from 'src/app/core/pipe/first-letter.pipe';
import { NumberToWordsPipe } from 'src/app/core/pipe/number-to-words.pipe';

@NgModule({
  declarations: [
    FirstLetterPipe,
    NumberToWordsPipe
    ],
  imports: [
    CommonModule,
  ],
  exports:[
    FirstLetterPipe,
    NumberToWordsPipe
  ]
})
export class SharedModule { }
