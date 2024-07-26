import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/layout/service/breadcrumb-service.service';
import { LayoutService } from '../service/app.layout.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {
  // breadcrumbs: Array<{ label: string, routerLink: string }> = [];
  breadcrumbs: MenuItem[] = []; 
  home: MenuItem | undefined;
  static ROUTE_DATA_BREADCRUMB: any;
  constructor(public layoutService: LayoutService,private breadcrumbService: BreadcrumbService, private router: Router, private activatedRoute: ActivatedRoute,private location: Location) { }

  ngOnInit(): void {
    this.home = { icon: 'pi pi-home', routerLink: '/' };


    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumbs(this.activatedRoute.root);
    });

    // Retrieve breadcrumb data from local storage on component initialization
    // const storedBreadcrumbs = localStorage.getItem('breadcrumbs');
    // if (storedBreadcrumbs) {
    //   this.breadcrumbs = JSON.parse(storedBreadcrumbs);
    // }
  }

  private updateBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      this.breadcrumbs = breadcrumbs;
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;

        const data = child.snapshot.data;
        if (data && data['breadcrumb']) {
          breadcrumbs.push({ label: data['breadcrumb'], routerLink: url });
        }
      }
      // Recursively call for child routes
      return this.updateBreadcrumbs(child, url, breadcrumbs);
    }
    this.breadcrumbs = breadcrumbs.reverse(); // Reverse if needed for correct order
    return breadcrumbs;
  }


  pageReload(){
    window.location.reload();
  }
  goBack(){
    this.location.back();
    // let previousLink = '/';
    // console.log(this.breadcrumbs.length);
    
    // if(this.breadcrumbs.length>1){
    //   previousLink = this.breadcrumbs.slice(-2, -1)[0].routerLink[0];
    // }
    // this.router.navigate([previousLink]);
  }
}
