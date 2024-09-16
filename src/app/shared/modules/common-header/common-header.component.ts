import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'app-common-header',
    templateUrl: './common-header.component.html',
    styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent {
  @Input() headerName: string = '';
  @Input() imgSrc: string = '';
  @Input() SubHeaderName: string = '';
  @Input() showButton: boolean = true;

  constructor(private router: Router) { }

}
