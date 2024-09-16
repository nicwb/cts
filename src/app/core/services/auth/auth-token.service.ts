import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Application, IJwtDecodedToken, IJwtToken, Role } from '../../models/jwt-token';
import { Observable, from, map, of, retry } from 'rxjs';
import { IRolesPermissions } from '../../models/roles-permissions';

@Injectable({
    providedIn: 'root',
})
export class AuthTokenService {
    jwtHelper = new JwtHelperService();
    decodedToken: IJwtDecodedToken | any;
    jwtToken: IJwtToken | any;
    constructor() {}
    getToken(): string {
        // console.log('****->',window.localStorage['jwtToken']);
        return window.localStorage['jwtToken'];
    }

    saveToken(token: string): void {
        window.localStorage['jwtToken'] = token;
    }

    destroyToken(): void {
        window.localStorage.removeItem('jwtToken');
    }
    getDecodeToken(): Application|any {
        this.jwtToken = this.jwtHelper.decodeToken(this.getToken());
        // console.log('->jwt',this.jwtToken);
        if(this.jwtToken!=null){
            this.decodedToken = JSON.parse(this.jwtToken.application);
            return this.decodedToken;
        }
    }
    getRolesWithPermissions(): Role[] {
        this.decodedToken = this.getDecodeToken();
        if(this.decodedToken!=null){
            return this.decodedToken.Roles;
        }
        return [];
    }
    transformRoles(): IRolesPermissions {
        const transformedRoles: IRolesPermissions = {};
        const roles = this.getRolesWithPermissions();
        roles.forEach((role) => {
            transformedRoles[role.Name] = {
                name: role.Name,
                validationFunction: role.Permissions,
            };
        });

        return transformedRoles;
    }
    loadRolesAndPermissions(): Observable<Role[]> {
        return of(this.getRolesWithPermissions());
    }
}
