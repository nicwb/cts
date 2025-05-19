import { Component, isDevMode } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
    appVersion = environment.appVersion;
    constructor(
        public layoutService: LayoutService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        if (isDevMode()) {
            this.appVersion += '-dev';
        }
    }

    getApiVersion() {
        return this.authService.getApiVersion();
    }
}