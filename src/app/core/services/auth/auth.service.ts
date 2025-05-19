import { Injectable, isDevMode, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from './auth-token.service';
import {
    Application,
    IJwtDecodedToken,
    IJwtToken,
    IUserDetails,
    Role,
} from '../../models/jwt-token';
import { NgxPermissionsService } from 'ngx-permissions';
import { localStorageService } from '../Token/localStorage.service';
import { catchError, EMPTY, firstValueFrom, Observable, of, Subscription, tap, timer } from 'rxjs';
import { NotificationService } from '../notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

interface AuthObject {
    role: string;
    permissions: string[];
    level: string;
    scope: string;
    nameid: string;
    name: string;
    iat: number;
    nbf: number;
    exp: number;
}


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private accessToken = signal('');
    private refreshToken = signal('');
    private accessTokenExpired = signal(false);
    private refreshTokenExpired = signal(false);
    private tokenTimer: Subscription = null!;
    private counter: Subscription = null!;
    public remainingTime = signal(300);
    private refreshTokenValidityInMinutes = 5;
    private apiVersion = signal('');

    startTokenTimer(forSeconds: number, onTokenExpiry: Function = () => {
        this.remainingTime.set(100);
    }) {
        if (this.tokenTimer && !this.tokenTimer.closed) {
            this.tokenTimer.unsubscribe();
            // console.log('resetTokenTimer');
        } else {
            // console.log('startTokenTimer');
        }
        this.countDownTimer(this.remainingTime());
        this.tokenTimer = timer(forSeconds * 1000).subscribe(() => {
            this.stopTokenTimer();
            onTokenExpiry();
        });
    }

    stopTokenTimer() {
        if (this.tokenTimer) {
            this.tokenTimer.unsubscribe();
            // console.log('stopTokenTimer');
        }
        if (this.counter && !this.counter.closed) {
            this.counter.unsubscribe();
        }
        if (this.accessTokenExpired()) {
            if (this.refreshTokenExpired()) {
                this.refreshTokenExpired.set(true);
                this.logout();
            }
            return;
        }
        this.countDownTimer(this.refreshTokenValidityInMinutes * 60);
        this.accessTokenExpired.set(true);
    }

    countDownTimer(forSeconds: number) {
        if (this.counter && !this.counter.closed) {
            this.counter.unsubscribe();
        }
        this.remainingTime.set(forSeconds);
        this.counter = timer(1000, 1000).subscribe(() => {
            this.remainingTime.set(this.remainingTime() - 1);
            if (this.remainingTime() === 0) {
                this.stopTokenTimer();
            }
        });
    }

    setApiVersion(version: string) {
        var style: string = "margin: 0.5em; padding: 0.5em; font-size: 2em;color: white; border: 4px solid gold; border-radius: 10px; background-color: indigo;";
        if (isDevMode()) {
            this.apiVersion.set(version.substring(0, 14));
        } else {
            this.apiVersion.set(version.substring(0, 27));
        }
        console.log("%cAPI: v" + this.apiVersion(), style);
    }

    getApiVersion(): string {
        return this.apiVersion();
    }

    setTokenExpired() {
        this.accessTokenExpired.set(true);
    }

    isTokenExpired(): boolean {
        // console.log("Access token expired: " + this.accessTokenExpired());
        return this.accessTokenExpired();
    }

    setRefreshTokenValidityInMinutes(minutes: number) {
        this.refreshTokenValidityInMinutes = minutes;
    }

    isRefreshTokenExpired(): boolean {
        return this.refreshTokenExpired();
    }

    getAccessToken(): string {
        if (this.accessToken() == '') {
            this.accessToken.set(localStorage.getItem('accessToken') ?? localStorageService.get('auth_token'));
        }
        return this.accessToken();
    }

    setAccessToken(token: string) {
        this.accessToken.set(token);
        localStorage.setItem('accessToken', token);
        this.accessTokenExpired.set(false);
        this.loadJwt(token);
        // console.log("setAccessToken: " + this.getAccessToken());
    }

    getRefreshToken(): string {
        if (this.refreshToken() == '') {
            this.refreshToken.set(localStorage.getItem('refreshToken') ?? '');
        }
        return this.refreshToken();
    }

    setRefreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
        this.refreshToken.set(token);
    }

    constructor(
        private router: Router,
        private notify: NotificationService,
        private http: HttpClient,
        private authTokenService: AuthTokenService,
        private ngxPermissionsService: NgxPermissionsService
    ) { }
    jwtHelper = new JwtHelperService();
    jwtToken!: IJwtToken | null;
    getExpiration = (authObj: AuthObject): number => {
        return authObj.exp;
    };

    get user() {
        const decodedToken = localStorageService.get('decoded_jwt_payload');
        if (decodedToken) {
            // console.log(JSON.parse(localStorageService.get('decoded_jwt_payload'))   +"gyugfuyjuctfiug");
            // console.log(localStorageService.get('decoded_jwt_payload'));
            // return localStorageService.get('decoded_jwt_payload')
            return JSON.parse(localStorageService.get('decoded_jwt_payload'));
        } else {
            this.logout();
        }
    }

    get jwt() {
        return localStorageService.get('auth_token');
    }

    get parsedJwt() {
        return this.parseJwt(this.jwt);
    }
    parseJwt(token: string) {
        const jwtHelper = new JwtHelperService();
        return jwtHelper.decodeToken(token);
    }

    getRolesWithPermissions(token: string): Role {
        let decodedToken: any = this.parseJwt(token)
        const currentTime = Math.floor(Date.now() / 1000);
        // this line is required for testing as the token validation time is not valid time.
        // so we aer adding 60 seconds to the token expiration time to bypass this validation
        isDevMode() && decodedToken && (decodedToken.exp = Math.floor(Date.now() / 1000) + 60000);
        // console.log(decodedToken?.exp, currentTime);
        // console.log(decodedToken);
        // console.log(typeof(decodedToken?.permissions));
        // console.log(decodedToken?.permissions);
        if (decodedToken && this.getExpiration(decodedToken) < currentTime) {
            this.logout();
            return {} as Role;
        }
        let role: Role;
        if (token != null) {
            role = {
                Id: decodedToken.id,
                Name: decodedToken.role,
                Permissions: JSON.parse(decodedToken.permissions)
            }
            return role;
        }
        //console.log('no token');

        return {} as Role;
    }

    toLowercaseKeys(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(this.toLowercaseKeys);
        } else if (obj !== null && typeof obj === 'object') {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                const newKey = key.charAt(0).toLowerCase() + key.slice(1);
                acc[newKey] = this.toLowercaseKeys(value);
                return acc;
            }, {} as any);
        }
        return obj;
    }


    loadRolesAndPermissions(): Observable<Role> {
        const token = localStorageService.get('auth_token');
        return of(this.getRolesWithPermissions(token));
    }

    //   validateToken(token: string): boolean {
    //     const decodedToken = this.jwtHelper.decodeToken(token);
    //     if (decodedToken.exp < Date.now() / 1000 && environment.production!=false) {
    //         return false;
    //     }
    //     return true;
    // }



    userLogout() {
        this.clearAll();
        window.self.close();
        this.router.navigate(['/login']);
    }
    clearAll() {
        localStorage.clear();
        this.ngxPermissionsService.flushPermissions();
    }
    getUserDetails(): IUserDetails {
        const decodedToken: IJwtDecodedToken | any =
            this.authTokenService.getDecodeToken();
        let userDetails!: IUserDetails;

        if (decodedToken != null) {
            userDetails = {
                Id: decodedToken.Id,
                Name: decodedToken.Name,
                Role: decodedToken.Roles,
                Level: {
                    Id: decodedToken.LevelId,
                    Name: decodedToken.Name,
                    Scope: decodedToken.Scope,
                },
            };
        }

        return userDetails;
    }
    get isLoggedin(): boolean {
        if (!(JSON.parse(localStorageService.get('iL') || 'false') && localStorageService.get('auth_token') !== null && localStorageService.get('decoded_jwt_payload') !== null)) {
            return false;
        }
        const authObj = JSON.parse(localStorageService.get('decoded_jwt_payload'));
        const currentTime = Math.floor(Date.now() / 1000);
        // return this.getExpiration(authObj) < currentTime; // testing
        return this.getExpiration(authObj) > currentTime; // original
    }

    set isLoggedin(v: boolean) {
        localStorageService.set('iL', v);
    }

    loadJwt(token: string): boolean {
        const parsedToken = this.parseJwt(token);
        if (parsedToken) {
            localStorageService.set('auth_token', token);
            localStorageService.set('decoded_jwt_payload', JSON.stringify(parsedToken));
            this.isLoggedin = true;
            return true;
        } else {
            return false;
        }
    }

    logout() {
        firstValueFrom(
            this.http.get(
                environment.BaseURL + 'api/' + '/Auth/Logout',
                { headers: new HttpHeaders().set('Authorization', this.accessToken()) }
            ).pipe(
                tap(() => {
                    this.notify.confirmLogout()
                        .then(() => {
                            this.invalidateSession();
                        });
                }),
                catchError((error) => {
                    this.notify.confirmLogout('Logout', 'Unable to logout!')
                        .then(() => {
                            this.invalidateSession();
                        });
                    return EMPTY;
                })
            )
        );
        // alert(environment.authUrl);
    }

    invalidateSession() {
        this.ngxPermissionsService.flushPermissions();
        localStorageService.del('decoded_jwt_payload');
        localStorageService.del('auth_token');
        localStorageService.del('iL');
        localStorageService.del('th');
        localStorageService.del('sidebar_drawer');
        window.open(environment.BaseURL, '_self');
    }

}