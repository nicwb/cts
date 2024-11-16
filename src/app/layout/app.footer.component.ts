import { Component } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent {
    readonly clientVersion = import.meta.env.NG_APP_VERSION;
    constructor(public layoutService: LayoutService) { }
}
