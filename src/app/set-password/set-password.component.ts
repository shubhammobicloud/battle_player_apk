import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/users/users.service';
import { ForgetPasswordService } from '../services/forgot-password/forgot-password.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent implements OnInit {
  isPasswordMatch(): boolean {
    return this.password === this.confirmPassword;
  }
  password: string = '';
  confirmPassword: string = '';
  passwordMismatchError: string = ''; // New variable to hold password mismatch error message
  constructor(
    private http: HttpClient,
    private router: ActivatedRoute,
    private route: Router,
    private userService:UserService,
    private forgerPasswordService:ForgetPasswordService,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {


    let lang:any=localStorage.getItem('lang')
    translate.use(lang);

  }
redirectedForm:any;
  ngOnInit(): void {
      this.redirectedForm = sessionStorage.getItem('redirectFrom');

  }
  setPassword(): void {
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match. Please try again.');
      return;
    }

    let validatePass = this.validatePassword(this.password);
    let token = this.router.snapshot.params['token'];

    if (validatePass) {
      if (this.password !== this.confirmPassword) {
        this.passwordMismatchError ='Passwords do not match. Please try again.';
        this.toastr.error(this.passwordMismatchError);
        return;
      } else {
        this.passwordMismatchError = '';
      }
      let data = {
        password: this.confirmPassword,
        token: token,
        firstLogin: true,
      };
      if (!this.validatePassword(this.password)) {
        this.toastr.warning('Password should be at least 8 characters long, must contain numbers, and alphabets.');
        return;
      }
     this.userService.setPassword(data).subscribe(
        (res: any) => {
          if ((res.success)) {
              this.route.navigate(['/playername',token]);
            }


        });
  } else {
    this.toastr.warning(
      'Password Should Be At Least Of Minimun 8 Character, Must Contain Number And Alphabets'
    );
  }
  }

  validatePassword(password: string): boolean {
    // Customize your password validation criteria
    const minLength = 8;
    const containsLettersAndNumbers = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

    return (
      password.length >= minLength && containsLettersAndNumbers.test(password)
    );
  }
// public passwordhide:boolean=false;
// public togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;

//     }
  public showPassword: boolean = false;
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  isPasswordValid(): boolean {
    // Define your password pattern criteria
    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(this.password);
    const hasUpperCase = /[A-Z]/.test(this.password);
    const hasNumber = /\d/.test(this.password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(this.password);

    // Check if the password meets all criteria
    return (
     !! this.password &&
      this.password.length >= minLength &&
      hasLowerCase &&
      hasUpperCase &&
      hasNumber &&
      hasSpecialChar
    );
  }
}
