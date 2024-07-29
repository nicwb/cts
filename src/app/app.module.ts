import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { LoadingIndeterminateService } from './layout/service/loading-indeterminate.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { OptionCardComponent } from './shared/modules/option-card/option-card.component';
import { StepsModule } from 'primeng/steps';
import { TokenListComponent } from './shared/modules/token-list/token-list.component';
import { ServerDownComponent } from './shared/components/server-down/server-down.component';
import { LoginComponent } from './features/login/login.component';
import { HasRoleDirective } from './core/directive/has-role.directive';
import { NgxPermissionsModule, NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { AuthTokenService } from './core/services/auth/auth-token.service';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ReturnMemoComponent } from './features/return-memo/return-memo.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StaticLoginComponent } from './features/static-login/static-login.component';
import { PaymentMandateComponent } from './features/payment-mandate/payment-mandate.component';
import { CommonHeaderComponent } from './shared/modules/common-header/common-header.component';
import { DynamicTableComponent } from './shared/modules/dynamic-table/dynamic-table.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
@NgModule({
    declarations: [
        AppComponent, NotfoundComponent, ServerDownComponent, LoginComponent, NotFoundComponent, StaticLoginComponent,
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ToastModule,
        NgxPermissionsModule.forRoot(),
        NgxSpinnerModule,
        BreadcrumbModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
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
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, MessageService, LoadingIndeterminateService, DatePipe, DividerModule, StepsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule { }
