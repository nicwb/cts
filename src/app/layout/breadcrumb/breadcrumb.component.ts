import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/layout/service/breadcrumb-service.service';
import { LayoutService } from '../service/app.layout.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
    breadcrumbs: MenuItem[] = [];
    navigationSubscription: Subscription;
    viewportWidth: number = window.innerWidth;
    home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

    constructor(
        public layoutService: LayoutService,
        private breadcrumbService: BreadcrumbService,
        private location: Location,
        public router: Router
    ) {
        this.navigationSubscription =
            this.breadcrumbService.routeChangeHandler$.subscribe(() => {
                this.updateBreadcrumbs();
            });
    }

    ngOnInit(): void {
        this.updateBreadcrumbs();
    }

    ngOnDestroy() {
        this.navigationSubscription.unsubscribe();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.viewportWidth = (event.target as Window).innerWidth;
        this.updateBreadcrumbs();
    }

    updateBreadcrumbs() {
        const allBreadcrumbs = this.breadcrumbService.breadcrumbs.map(
            (crumb, index) => {
                return {
                    label: crumb.label,
                    routerLink: crumb.url,
                    command: (event: any) => {
                        event.originalEvent?.preventDefault();

                        // If clicking the current page's breadcrumb, do nothing
                        if (this.router.url === crumb.url) {
                            return;
                        }

                        // Otherwise, navigate to the clicked breadcrumb's page
                        this.router
                            .navigate([crumb.url])
                            .catch(() => this.location.back());
                    },
                };
            }
        );

        this.breadcrumbs =
            this.viewportWidth <= 678
                ? allBreadcrumbs.slice(-2)
                : allBreadcrumbs;
    }

    pageReload() {
        window.location.reload();
    }

    goBack() {
        this.location.back();
    }
}
