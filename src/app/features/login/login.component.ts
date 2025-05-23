import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxRolesService } from 'ngx-permissions';
import {
    HttpClient,
    HttpClientModule,
    HttpHeaders,
} from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [HttpClientModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    token: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private http: HttpClient,
        private ngxRolesService: NgxRolesService
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem(environment.accessTokenKey);
        if (this.token) {
            this.ssoLogin();
        } else {
            this.authService.logout();
        }
    }

    async ssoLogin() {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.token,
            }),
        };
        const url = environment.BaseURL + environment.version + '/Auth/Login';
        try {
            const response = await firstValueFrom(
                this.http.get<{ status: any }>(url, httpOptions)
            );
            if (response.status === 'ValidToken') {
                this.authService.loadJwt(this.token);
                const roles = this.authService.getRolesWithPermissions(
                    this.token
                );
                if (roles.name && roles.permissions) {
                    this.ngxRolesService.addRoleWithPermissions(
                        roles.name,
                        roles.permissions
                    );
                } else {
                    alert('Roles, Permission structure is invalid.');
                    return;
                }
                this.router.navigate(['dashboard']);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Token',
            });
        }

        await this.getApiVersion();
    }

    async getApiVersion() {
        const request = this.http.get<{ Version: string }>(
            environment.OpenApiBaseURL + '/get-version'
        );

        try {
            const response = await firstValueFrom(
                request.pipe(
                    tap((res) => {
                        this.authService.setApiVersion(res.Version);
                    })
                )
            );
        } catch (error) {
            console.error('Error:', error);
        }
    }

    login() {
        window.location.href = 'http://localhost:4200/#/';
    }
}
