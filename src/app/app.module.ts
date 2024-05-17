import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { PagesModule } from './pages/pages.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { SetPasswordComponent } from './auth/components/set-password/set-password.component';
import { MatSelectModule } from "@angular/material/select";
import { ToastrModule } from 'ngx-toastr';
import { ForgotpasswordComponent } from './auth/components/forgotpassword/forgotpassword.component';
// src/app/pages/component/communications/newspost/newspost.component.html
import { MatIconModule } from '@angular/material/icon';
import { AuthInterceptor } from './services/interceptor/auth-interceptor.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TeamImageComponent } from './auth/components/team-image/team-image.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker'
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    PagesModule,
    AuthModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {timeOut: 2000,
        extendedTimeOut: 2000,
        preventDuplicates: true}
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
        deps: [HttpClient],
      }
    }),
    ServiceWorkerModule.register('service-worker.js')
  ],
  providers: [
    TranslateService,
    {
      provide: SwRegistrationOptions,
      useFactory: () => ({enabled: location.search.includes('sw=true')}),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
