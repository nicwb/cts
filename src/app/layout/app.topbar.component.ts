import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../core/services/auth/auth.service';
import { IUserDetails } from '../core/models/jwt-token';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService],
})
export class AppTopBarComponent implements OnInit {
    timeExpired = false;
    userDetais: IUserDetails | undefined;
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

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
        const isLoggedIn = this.authService.isLoggedin();
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

    async onTimeExpired(): Promise<void> {
        this.timeExpired = true;
        this.toastService.showError('Access token expired!');
        await this.router.navigate(['/static-login']);
    }
}
