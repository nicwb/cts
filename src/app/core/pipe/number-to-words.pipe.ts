import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

    transform(value: number): string {
        const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if (value === 0) {
            return 'zero';
        }

        if (value < 10) {
            return singleDigits[value];
        }

        if (value < 20) {
            return teens[value - 10];
        }

        if (value < 100) {
            return tens[Math.floor(value / 10)] + (value % 10 !== 0 ? ' ' + singleDigits[value % 10] : '');
        }

        if (value < 1000) {
            return (
                singleDigits[Math.floor(value / 100)] +
        ' Hundred' +
        (value % 100 !== 0 ? ' and ' + this.transform(value % 100) : '')
            );
        }

        // Add support for larger numbers as needed

        return 'Number too large to convert';
    }

}
