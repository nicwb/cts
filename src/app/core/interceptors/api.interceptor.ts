import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    private jwtHelper = new JwtHelperService();

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log('Interceptor called');
        const token = localStorage.getItem('jwtToken');
        console.log('Token from local storage:', token);

        if (token) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            console.log('Decoded token:', decodedToken);

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(request).pipe(
            tap((response) => {
                if (response instanceof HttpResponse) {
                    const headers = response.headers;
                    const tokenTimeRemaining = parseInt(
                        headers.get('Remainingtime') || '10',
                        10
                    );
                    if (tokenTimeRemaining > 0) {
                        console.log(
                            'Token is valid, time remaining:',
                            tokenTimeRemaining
                        );
                    } else if (tokenTimeRemaining === 0) {
                        console.log('Token has expired', tokenTimeRemaining);
                    } else {
                        console.log('Token is invalid', tokenTimeRemaining);
                    }
                }
            })
        );
    }
}
