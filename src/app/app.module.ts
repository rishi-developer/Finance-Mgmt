import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './common-services/api-interceptor/api.interceptor';
import { environment } from 'src/environments/environment';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdvisorModule } from './modules/advisor/advisor.module';
import { BrokerModule } from './modules/broker/broker.module';
import { LoginModule } from './modules/login/login.module';
import { SharedModule } from './shared/shared.module';
import { LoaderComponentComponent } from './modules/loader/loader-component/loader-component.component';
import { LoaderService } from './modules/loader/service/loader.service';
import { LoaderInterceptor } from './modules/loader/interceptor/loader.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ErrorPageComponent } from './modules/error-page/error-page.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    LoaderComponentComponent,
    ErrorPageComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    BrokerModule,
    //LoginModule,
    MatProgressSpinnerModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  exports: [SharedModule],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
