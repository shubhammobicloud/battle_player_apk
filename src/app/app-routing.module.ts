import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlayerNameComponent } from './player-name/player-name.component';
import { PlayerImageComponent } from './player-image/player-image.component';
const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'playername',
    component:PlayerNameComponent
  },
  {
    path:'playerimage',
    component:PlayerImageComponent
  },
  {
    path: 'home',
    loadChildren: () => {
      return import('./pages/pages.module').then((m) => m.PagesModule);
    }
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
