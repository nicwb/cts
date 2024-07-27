import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<MenuItem[]>([]);
  public breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumb: MenuItem[] = this.createBreadcrumbs(root);
      this.breadcrumbsSubject.next(breadcrumb);
    });
  }
  private createBreadcrumbs(route: any, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: any[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }
    for (const child of children) {
      const routeURL: string = child.routeConfig ? child.routeConfig.path : '';
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      const label = child.routeConfig && child.routeConfig.data ? child.routeConfig.data['breadcrumb'] : '';
      if (label !== '') {
        breadcrumbs.push({label:label, routerLink: url });
      }
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
