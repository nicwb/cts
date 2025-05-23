import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { catchError, from, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        try {
            // Skip adding Authorization header for anonymous requests
            if (this.isAnonymousRoute(request)) {
                return next.handle(request);
            }

            if (this.authService.isTokenExpired()) {
                const refreshToken = this.authService.getRefreshToken();
                return this.makeRefreshTokenRequest(
                    refreshToken,
                    environment.refreshTokenUrl
                ).pipe(
                    switchMap((response) => {
                        this.authService.setAccessToken(response.accessToken);
                        this.authService.setRefreshToken(response.refreshToken);
                        const authReq = request.clone({
                            headers: request.headers.set(
                                'Authorization',
                                `Bearer ${response.accessToken}`
                            ),
                        });
                        return this.makeApiRequestWithAccessToken(
                            authReq,
                            next
                        );
                    })
                );
            }

            const authReq = request.clone({
                headers: request.headers.set(
                    'Authorization',
                    `Bearer ${this.authService.getAccessToken()}`
                ),
            });
            return this.makeApiRequestWithAccessToken(authReq, next);
        } catch (error) {
            // console.log(error);
            throw error;
        }
    }

    private isAnonymousRoute(request: HttpRequest<unknown>): boolean {
        return ['get-version'].some((route) => request.url.includes(route));
    }

    private makeRefreshTokenRequest(
        refreshToken: string,
        refreshTokenUrl: string
    ): Observable<{ accessToken: string; refreshToken: string }> {
        console.log('makeRefreshTokenRequest called');
        console.log('refreshToken:', refreshToken);
        console.log('refreshTokenUrl:', refreshTokenUrl);

        return from(
            fetch(refreshTokenUrl, {
                headers: { Authorization: `Bearer ${refreshToken}` },
            }).then((response) => {
                console.log('response:', response);
                return response.json();
            })
        ).pipe(
            switchMap((response) => {
                console.log('response.json():', response);

                if (
                    response.apiResponseStatus === 1 &&
                    response.result != null
                ) {
                    console.log('accessToken and refreshToken received');
                    this.authService.setAccessToken(
                        response.result.accessToken
                    );
                    this.authService.setRefreshToken(
                        response.result.refreshToken
                    );
                    return new Observable<{
                        accessToken: string;
                        refreshToken: string;
                    }>((observer) => {
                        console.log(
                            'emitting new accessToken and refreshToken'
                        );
                        observer.next({
                            accessToken: response.result.accessToken,
                            refreshToken: response.result.refreshToken,
                        });
                        observer.complete();
                    });
                } else {
                    console.log('accessToken and refreshToken not received');
                    this.authService.logout();
                    return new Observable<{
                        accessToken: string;
                        refreshToken: string;
                    }>((observer) => {
                        console.log(
                            'emitting empty accessToken and refreshToken'
                        );
                        observer.next({ accessToken: '', refreshToken: '' });
                        observer.complete();
                    });
                }
            })
        );
    }

    private makeApiRequestWithAccessToken(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            tap((response) => {
                if (response instanceof HttpResponse) {
                    const headers = response.headers;
                    const tokenTimeRemaining = parseInt(
                        headers.get('Remaining-Time') || '300'
                    );
                    console.log(
                        `Remaining token time: ${tokenTimeRemaining} seconds`
                    );

                    this.authService.remainingTime.set(tokenTimeRemaining);
                    if (tokenTimeRemaining > 0) {
                        this.authService.startTokenTimer(tokenTimeRemaining);
                    }
                }
            }),
            catchError((error) => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401
                ) {
                    // this.auth.invalidateSession();
                    return throwError(() => error);
                }
                throw error;
            })
        );
    }
}
