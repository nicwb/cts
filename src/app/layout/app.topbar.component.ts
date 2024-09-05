import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '../core/services/auth/auth.service';
import { IUserDetails } from '../core/models/jwt-token';
import { BreadcrumbService } from './service/breadcrumb-service.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService]
})
export class AppTopBarComponent implements OnInit {
    userDetais:IUserDetails | undefined;
    items!: MenuItem[];
    breadcrumbs: { label: string, routerLink: string }[] = [];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    
    constructor(public layoutService: LayoutService,
        private authService:AuthService,
        private confirmationService: ConfirmationService,
        private breadcrumbService: BreadcrumbService
    ) { 
        this.userDetais =  authService.getUserDetails();
        console.log(this.breadcrumbs);
    }

    ngOnInit(): void {
        this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
            this.breadcrumbs = breadcrumbs;
        });
    }

    logOut(){
        this.authService.userLogout();
    }
    logoutConfirmation(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to logout?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
               this.logOut();
            },
            reject: () => {
                
            }
        });
    }
}
