import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environment/enviroment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private http: HttpClient,
    private route: Router,
    private toastr: ToastrService
  ) {}

  login() {
    if (this.loginForm.valid) {
      this.http
        .post(`${environment.baseUrl}/user/signin`, this.loginForm.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.message == 'Login successfully.') {
              localStorage.setItem('token', res.data);
              localStorage.setItem('userId', res._id);
              localStorage.setItem('teamId', res.teamId);
              localStorage.setItem('avatar', res.avatar);
              localStorage.setItem('userName', res.userName);
              if (!res.firstLogin) {
                this.toastr.success('Login successfully.');
                this.route.navigate(['/home']);
                this.route.navigate(['/', 'set-password', res._id]);
              } else {
                this.toastr.success(
                  'Login successfully.',
                  'Please SetPassword '
                );
              }
            }
            // debugger
          },
          (error: HttpErrorResponse) => {
            console.log('error', error.error.error);
            // alert(error.error.error);
            this.toastr.error(error.error.error);
          }
        );
    }
  }
}
