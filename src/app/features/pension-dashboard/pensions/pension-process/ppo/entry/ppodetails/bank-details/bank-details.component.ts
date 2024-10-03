import { Component, Input } from '@angular/core';




@Component({
    selector: 'app-bank-details',
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent {

    @Input() ppoId?: string;
    @Input() pensionerName?: string;

    constructor() {}
}
