import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/users/users.service';
import {jwtDecode} from 'jwt-decode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    role:  new FormControl('user', Validators.required),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/),
      ],
    }),
  });
  hide = true;

  public showPassword: boolean = false;
  // get emailInput() { return this.emailInput.get('email'); }
  // get passwordInput() { return this.p.get('password'); } 
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  constructor(
    private route: Router,
    private toastr: ToastrService,
    private userService:UserService
  ) {}

  login() {
    if (this.loginForm.valid) {
     this.userService.signIn(this.loginForm.value).subscribe(
          (res: any) => {
            if (res.message == 'Login successfully.') {
              localStorage.setItem('token', res.data.token);
              let data :{_id:any,teamId:any}= jwtDecode(res.data.token);
              localStorage.setItem('userId', data._id);
              localStorage.setItem('teamId', data.teamId);
              // console.log("data", data)
              if (!res.data.firstLogin) {
                this.toastr.success(
                  'Login successfully'
                );
                sessionStorage.setItem('redirectFrom', 'login'); // Or 'forgot-password'

                this.route.navigate(['/', 'set-password', res.data.token]);
              } else {
                this.route.navigate(['/home']);
                this.toastr.success('Login successfully.');
              }
            }
          },(error)=>{
            this.toastr.error(error.error.message)
          }

        );
    }else{
      this.toastr.error('Please enter the field')
    }
  }
}