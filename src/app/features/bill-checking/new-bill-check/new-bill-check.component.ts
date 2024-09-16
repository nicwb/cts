import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
    selector: 'app-new-bill-check',
    templateUrl: './new-bill-check.component.html',
    styleUrls: ['./new-bill-check.component.scss']
})
export class NewBillCheckComponent implements OnInit {
    routeItems: MenuItem[]=[];

    constructor() { }

    ngOnInit(): void {
        this.routeItems = [
            { label: 'Bill Details', routerLink: 'bill-details' },
            { label: 'List Of Objection', routerLink: 'role' },
            // { label: 'BY Transfer', routerLink: 'confirmation' },
            // { label: 'PL Transfer', routerLink: 'confirmation' },
        ];
    }

}
