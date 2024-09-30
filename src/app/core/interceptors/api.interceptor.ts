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

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(private router: Router,private spinner: NgxSpinnerService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('jwtToken');
        // this.loadingIndeterminate.showLoading();
        // this.spinner.show();
        var baseURL = environment.BaseURL;
        if(request.url.startsWith("http")) {
            baseURL = "";
        }
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                url: `${baseURL}${request.url}`,
            });
        } else {
            request = request.clone({ url: `${baseURL}${request.url}` });
        }

        return next.handle(request).pipe(
            tap(
                (event) => {

                    if (event instanceof HttpResponse) {
                        // Do something with the successful response
                    }
                },
                // (error) => {
                //     if (error.status == 401) {
                //         this.router.navigate(['/login']);
                //     }
                //     if(error.status == 0){
                //     // this.router.navigate(['/server-down']);
                //     }
                // }
            ),
            // finalize(() => {
            //     // this.loadingIndeterminate.hideLoading();
            //     this.spinner.hide();
            // })
        );
    }
}
