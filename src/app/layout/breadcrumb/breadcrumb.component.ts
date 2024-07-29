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
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  backButtonDisabled: boolean = false;
  constructor(public layoutService: LayoutService, private breadcrumbService: BreadcrumbService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
      this.backButtonDisabled = this.location.isCurrentPathEqualTo('/');
    });
  }


  pageReload() {
    window.location.reload();
  }
  goBack() {
    if (this.location.isCurrentPathEqualTo('/')) {
      this.backButtonDisabled = true;
      return;
    }
    let previousLink = '/';
    const breadcrumbsLength = this.breadcrumbs.length;
    if (breadcrumbsLength > 1) {
      previousLink = this.breadcrumbs[breadcrumbsLength - 2].routerLink;
    }
    this.router.navigate([previousLink]);
  }
}
