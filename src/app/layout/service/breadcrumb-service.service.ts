import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    breadcrumbs: Array<{ label: string; url: string }> = [];
    routeChangeHandler$: Observable<any>;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        // Listen for route changes
        this.routeChangeHandler$ = router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            tap(() => this.createBreadcrumbs())
        );
    }

    private createBreadcrumbs(): void {
        let currentRoute: ActivatedRoute | null = this.activatedRoute.root;
        this.breadcrumbs = [];

        // Loop through route tree and build breadcrumbs
        while (currentRoute) {
            const routeURL: string = currentRoute.snapshot.url
                .map((segment) => segment.path)
                .join('/');
            if (routeURL) {
                const breadcrumbLabel =
                    currentRoute.snapshot.data['breadcrumb'];
                const url = `/${routeURL}`;

                // Add the breadcrumb item
                this.breadcrumbs.push({
                    label: breadcrumbLabel || routeURL, // If no 'breadcrumb' data, use the route path as label
                    url: url,
                });
            }
            // Move to the first child of the current route
            currentRoute = currentRoute.firstChild;
        }
    }
}
