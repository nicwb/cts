import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<{ label: string, routerLink: string }[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd || event instanceof NavigationStart)
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs() {
    const route = this.router.routerState.snapshot.root;
    const breadcrumbs = this.extractBreadcrumbs(route);
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  private extractBreadcrumbs(route: ActivatedRouteSnapshot, breadcrumbs: { label: string, routerLink: string }[] = []): { label: string, routerLink: string }[] {
    if (route.routeConfig && route.routeConfig.data && (route.routeConfig.data as any)['breadcrumb']) {
      breadcrumbs.push({
        label: (route.routeConfig.data as any)['breadcrumb'],
        routerLink: this.getRouterLink(route)
      });
    }
    route.children.forEach((child: ActivatedRouteSnapshot) => this.extractBreadcrumbs(child, breadcrumbs));
    return breadcrumbs;
  }

  private getRouterLink(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(r => r.url.map(u => u.toString()).join('/'))
      .join('/');
  }
}
