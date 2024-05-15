import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { PlayerImageComponent } from './components/player-image/player-image.component';
import { PlayerNameComponent } from './components/player-name/player-name.component';
import { TeamImageComponent } from './components/team-image/team-image.component';
import { TeamNameComponent } from './components/team-name/team-name.component';
import { AuthMaterialModule } from './modules/auth-material.module';
import { AuthRoutingModule } from './modules/app-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AuthComponent,TeamNameComponent
    ,TeamImageComponent,
    LoginComponent,
    PlayerImageComponent,
    PlayerNameComponent,
    SetPasswordComponent,
    ForgotpasswordComponent,
  ],
  imports: [
    CommonModule,AuthMaterialModule, AuthRoutingModule,TranslateModule.forChild()
  ],providers:[TranslateService]
})
export class AuthModule { }
