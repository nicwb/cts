import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './layout/service/app.layout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    spinerColor: string = '';
    spinerBgColor: string = '';
    constructor(
        private primengConfig: PrimeNGConfig,
        private layoutService: LayoutService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
