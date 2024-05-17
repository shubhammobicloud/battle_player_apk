import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { ForgotpasswordComponent } from '../components/forgotpassword/forgotpassword.component';
import { SetPasswordComponent } from '../components/set-password/set-password.component';
import { PlayerImageComponent } from '../components/player-image/player-image.component';
import { PlayerNameComponent } from '../components/player-name/player-name.component';
import { TeamImageComponent } from '../components/team-image/team-image.component';
import { TeamNameComponent } from '../components/team-name/team-name.component';
import { AuthComponent } from '../auth.component';
const routes: Routes = [
  {
    path:'',
    component:AuthComponent,
    children:[
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'forgotpassword',
        component: ForgotpasswordComponent,
      },
      {
        path: 'set-password/:token',
        component: SetPasswordComponent,
      },
      {
        path: 'playername/:token',
        component: PlayerNameComponent,
      },
      {
        path: 'playerimage/:token',
        component: PlayerImageComponent,
      },
      {
        path: 'teamName/:token',
        component: TeamNameComponent,
      },
      {
        path: 'teamImage/:token',
        component: TeamImageComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
