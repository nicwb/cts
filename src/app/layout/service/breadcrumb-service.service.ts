import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    breadcrumbs: Array<{ label: string, url: string }> = [];
    routeChangeHandler$;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        
        this.routeChangeHandler$ = router.events.pipe(
            filter(
                (event) => event instanceof NavigationEnd
            )
        )
        .pipe(
            tap(
                () => this.breadcrumbs 
                = this.createBreadcrumbs(this.activatedRoute.root)
            )
        );
    }
    
    private createBreadcrumbs(
        route: ActivatedRoute,
        url: string = '/#/',
        breadcrumbs: Array<{ label: string, url: string }> = []
    ): Array<{ label: string, url: string }> 
    {
        const children: ActivatedRoute[] = route.children;
        // console.log(breadcrumbs);
        if (children.length === 0) {
            return breadcrumbs;
        }
        
        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `${routeURL}/`;
            }
            
            breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], url: url.replace(/\/+$/, '') });
            return this.createBreadcrumbs(child, url, breadcrumbs);
        }

        // this return statement will never be reached
        return breadcrumbs;
    }
}