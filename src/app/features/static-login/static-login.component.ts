import { Component, OnInit } from '@angular/core';
import { PensionService } from 'src/app/api';

@Component({
  selector: 'app-static-login',
  templateUrl: './static-login.component.html',
  styleUrls: ['./static-login.component.scss']
})
export class StaticLoginComponent implements OnInit {
  public readonly baseUrl : string;
  public readonly apiUrl;
  public readonly playwrightUrl : string;
  constructor(private service : PensionService) {
    this.apiUrl = service.configuration.basePath;
    this.baseUrl = import.meta.env.NG_APP_BASE_URL;
    this.playwrightUrl = import.meta.env.NG_APP_PLAYWRIGHT_BASE_URL
  }

  ngOnInit(): void {
  }

}
