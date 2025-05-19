import {
    Component,
    ElementRef,
    computed,
    isDevMode,
    ViewChild,
    OnInit,
} from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../core/services/auth/auth.service';
import { IUserDetails } from '../core/models/jwt-token';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService],
})
export class AppTopBarComponent implements OnInit {
    timeExpired = false;
    userDetais: IUserDetails | undefined;
    items!: MenuItem[];
    readonly clientVersion = import.meta.env.NG_APP_VERSION;
    appVersion = environment.appVersion;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    tokenRemainingTime = computed(() => this.authService.remainingTime());
    isTokenExpired(): boolean {
        return this.authService.isTokenExpired();
    }
    convertSeconds(seconds: number) {
        if (seconds <= 0) return '--:--';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private toastService: ToastService
    ) {
        this.userDetais = authService.getUserDetails();
    }
    async ngOnInit(): Promise<void> {
        if (isDevMode()) {
            this.appVersion += '-dev';
        }
        const isLoggedIn = this.authService.isLoggedin;
        if (!isLoggedIn) {
            await this.router.navigate(['/static-login']);
        }
    }
    logOut() {
        this.authService.userLogout();
    }
    logoutConfirmation(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to logout?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.logOut();
            },
            reject: () => {},
        });
    }

    onTimeExpired(): void {
        this.authService.logout();
    }
}
