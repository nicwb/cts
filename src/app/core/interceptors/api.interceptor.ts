import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private jwtHelper = new JwtHelperService();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor called');
    const token = localStorage.getItem('jwtToken');
    console.log('Token from local storage:', token);

    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded token:', decodedToken);

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      tap(() => console.log('Request handled'))
    );
  }
}