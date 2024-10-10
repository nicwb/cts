import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ApiModule, BASE_PATH } from './api';
import { environment } from 'src/environments/environment';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { LoadingIndeterminateService } from './layout/service/loading-indeterminate.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { StepsModule } from 'primeng/steps';
import { ServerDownComponent } from './shared/components/server-down/server-down.component';
import { LoginComponent } from './features/login/login.component';
import { NgxPermissionsModule, NgxRolesService } from 'ngx-permissions';
import { AuthTokenService } from './core/services/auth/auth-token.service';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StaticLoginComponent } from './features/static-login/static-login.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PensionerStatusModule } from './shared/modules/pensioner-status/pensioner-status.module';
@NgModule({
    declarations: [
        AppComponent, ServerDownComponent, LoginComponent, NotFoundComponent, StaticLoginComponent,
    ],
    imports: [
        ApiModule,
        AppRoutingModule,
        AppLayoutModule,
        ToastModule,
        NgxPermissionsModule.forRoot(),
        NgxSpinnerModule,
        RadioButtonModule,
        DropdownModule,
        InputTextModule,
        ButtonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        PensionerStatusModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        { provide: BASE_PATH, useValue: environment.OpenApiBaseURL},
        {
            provide: APP_INITIALIZER,
            useFactory: (authTokenService: AuthTokenService, rolesService: NgxRolesService) => function () {
                return authTokenService.loadRolesAndPermissions().subscribe((roles) => {
                    if (roles != null) {
                        roles.forEach(role => {
                            rolesService.addRoleWithPermissions(role.Name, role.Permissions);
                        });
                    }
                })
            },
            deps: [AuthTokenService, NgxRolesService],
            multi: true
        },
        MessageService, LoadingIndeterminateService, DatePipe, DividerModule, StepsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule { }
