import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
} from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from './spinner.service'; // Adjust the import path as necessary

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private spinner: NgxSpinnerService,
        private spinnerService: SpinnerService
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('jwtToken');
        const shouldShowSpinner = this.spinnerService.isSpinnerVisible();

        if (shouldShowSpinner) {
            this.spinner.show();
        }

        let baseURL = environment.BaseURL;
        if (request.url.startsWith("http")) {
            baseURL = "";
        }

        request = request.clone({
            url: `${baseURL}${request.url}`,
            setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        });

        return next.handle(request).pipe(
            tap(
                (event) => {
                    if (event instanceof HttpResponse) {
                        // Handle successful response
                    }
                },
                (error) => {
                    if (error.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    if (error.status === 0) {
                        // this.router.navigate(['/server-down']);
                    }
                }
            ),
            finalize(() => {
                if (shouldShowSpinner) {
                    this.spinner.hide();
                }
            })
        );
    }
}
