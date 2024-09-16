import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgxRolesService } from 'ngx-permissions';
import { AuthTokenService } from 'src/app/core/services/auth/auth-token.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private route:ActivatedRoute,private router:Router,private authService:AuthService,private authTokenService:AuthTokenService,private ngxRolesService:NgxRolesService) { }

    ngOnInit(): void {
        this.authService.clearAll();
        this.ngxRolesService.flushRoles();
        const token = this.route.snapshot.queryParamMap.get('token');
        if(token!=null){
            this.authTokenService.saveToken(token);
            const roles = this.authTokenService.getRolesWithPermissions();
            roles.forEach(role => {
                this.ngxRolesService.addRoleWithPermissions(role.Name, role.Permissions);
            });
            this.router.navigate(["/"]);
        }
    }
}
