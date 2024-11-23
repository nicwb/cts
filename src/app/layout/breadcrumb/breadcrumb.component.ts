import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/layout/service/breadcrumb-service.service';
import { LayoutService } from '../service/app.layout.service';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
    breadcrumbs: Array<{ label: string, url: string }> = [];
    navigationSubscription: Subscription;
    viewportWidth: number = window.innerWidth;

    constructor(
        public layoutService: LayoutService,
        private breadcrumbService: BreadcrumbService,
        private location: Location
    ) {
        this.navigationSubscription = this.breadcrumbService.routeChangeHandler$
            .subscribe(() => {
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
        const allBreadcrumbs = this.breadcrumbService.breadcrumbs;
        // Display the last two breadcrumbs if width <= 678px
        this.breadcrumbs = this.viewportWidth <= 678 ? allBreadcrumbs.slice(-2) : allBreadcrumbs;
    }

    pageReload() {
        window.location.reload();
    }

    goBack() {
        this.location.back();
    }
}
