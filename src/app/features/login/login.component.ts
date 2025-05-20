import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxRolesService } from 'ngx-permissions';
import { HttpClientModule } from '@angular/common/http';
import { AuthTokenService } from 'src/app/core/services/auth/auth-token.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PensionAuthService } from 'src/app/api';
import { catchError, forkJoin, of } from 'rxjs';
import { environment } from 'src/environments/environment';

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
        private authTokenService: AuthTokenService,
        private pensionAuthService: PensionAuthService,
        private ngxRolesService: NgxRolesService
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem(environment.accessTokenKey);

        if (this.token) {
            this.pensionAuthService
                .login()
                .pipe(
                    catchError((error) => {
                        this.router.navigate(['login']);
                        return of(null);
                    })
                )
                .subscribe((response) => {
                    if (response && response?.status === 'ValidToken') {
                        this.authTokenService.saveToken(this.token);
                        this.ngxRolesService.flushRoles();

                        forkJoin({
                            roles: this.pensionAuthService.getRoles(),
                            permissions:
                                this.pensionAuthService.getPermissions(),
                        }).subscribe((results) => {
                            const roleName = results.roles?.result?.roleName;
                            const permissions =
                                results.permissions?.result?.permissionNames ||
                                [];

                            if (roleName) {
                                this.ngxRolesService.addRoleWithPermissions(
                                    roleName,
                                    permissions
                                );
                            }

                            this.router.navigate(['pension-process'], {
                                state: { showLoginSuccess: true },
                            });
                        });
                    } else {
                        this.router.navigate(['login']);
                    }
                });
        } else {
            this.router.navigate(['login']);
        }
    }

    login() {
        window.location.href = 'http://localhost:4200/#/';
    }
}
