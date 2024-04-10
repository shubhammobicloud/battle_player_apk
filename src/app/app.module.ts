import { NgModule } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ToastrModule } from 'ngx-toastr';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';


import {MatIconModule} from '@angular/material/icon';
import { AuthInterceptor } from './services/interceptor/auth-interceptor.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlayerImageComponent,
    PlayerNameComponent,
    SetPasswordComponent,
    ForgotpasswordComponent,

  ],
  imports: [
    BrowserModule,
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
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
