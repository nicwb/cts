import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/layout/service/breadcrumb-service.service';
import { LayoutService } from '../service/app.layout.service';
import { filter, Observable, Subscription, tap } from 'rxjs';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
    breadcrumbs: Array<{ label: string, url: string }> = [];
    navigationSubscription: Subscription;
    constructor(
        public layoutService : LayoutService,
        private breadcrumbService: BreadcrumbService,
        private location: Location
    ) {
        this.navigationSubscription =  this.breadcrumbService.routeChangeHandler$
            .subscribe(() => {
                this.breadcrumbs = this.breadcrumbService.breadcrumbs;
            });
    }
        
    ngOnInit(): void {
        this.breadcrumbs = this.breadcrumbService.breadcrumbs;
    }
    ngOnDestroy(){
        this.navigationSubscription.unsubscribe();
    }
    pageReload(){
        window.location.reload();
    }
    goBack(){
        this.location.back();
    }
}