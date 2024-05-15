import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PagesModule } from './pages/pages.module';
import { PlayerImageComponent } from './player-image/player-image.component';
import { PlayerNameComponent } from './player-name/player-name.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { SetPasswordComponent } from './set-password/set-password.component';
import { MatSelectModule } from "@angular/material/select";
import { ToastrModule } from 'ngx-toastr';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
// src/app/pages/component/communications/newspost/newspost.component.html
import { MatIconModule } from '@angular/material/icon';
import { AuthInterceptor } from './services/interceptor/auth-interceptor.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TeamImageComponent } from './team-image/team-image.component';
import { MatCardModule } from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker'
@NgModule({
  declarations: [
    AppComponent,TeamImageComponent,
    LoginComponent,
    PlayerImageComponent,
    PlayerNameComponent,
    SetPasswordComponent,
    ForgotpasswordComponent,
  ],
  imports: [
    BrowserModule,MatSelectModule,MatCardModule,MatTooltipModule,
    RouterModule,
    PagesModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
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
