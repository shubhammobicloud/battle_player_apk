import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlayerNameComponent } from './player-name/player-name.component';
import { PlayerImageComponent } from './player-image/player-image.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { TeamNameComponent } from './team-name/team-name.component';
import { TeamImageComponent } from './team-image/team-image.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { NewspostComponent } from './pages/component/communications/newspost/newspost.component';
const routes: Routes = [
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
  },
{
    path: 'home',
    loadChildren: () => {
      return import('./pages/pages.module').then((m) => m.PagesModule);
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
