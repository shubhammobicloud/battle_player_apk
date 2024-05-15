import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordComponent } from './auth/components/forgotpassword/forgotpassword.component';
import { AuthGuardService  as authGuard} from './services/auth guard/auth-guard.service';
import { AppComponent } from './app.component';
const routes: Routes = [
{
  path: '',
  loadChildren:()=>{
    return import('./auth/auth.module').then(m=>m.AuthModule)
  }
},
{
    path: 'home',
    canActivate:[authGuard],
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
