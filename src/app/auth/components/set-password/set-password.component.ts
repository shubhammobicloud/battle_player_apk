import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/users/users.service';
import { ForgetPasswordService } from '../../../services/forgot-password/forgot-password.service';
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
      this.toastr.error(this.translate.instant('TOASTER_RESPONSE.PASSWORDS_NOT_MATCH_ERROR'));

      return;
    }

    let validatePass = this.validatePassword(this.password);
    let token = this.router.snapshot.params['token'];

    if (validatePass) {
      if (this.password == this.confirmPassword) {
        // this.passwordMismatchError ='Passwords do not match. Please try again.';
        let data = {
          password: this.confirmPassword,
          token: token,
          firstLogin: true,
        };
        // if (!this.validatePassword(this.password)) {
        //   this.toastr.warning('Password should be at least 8 characters long, must contain numbers, and alphabets.');
        //   return;
        // }
       this.userService.setPassword(data).subscribe(
          (res: any) => {
            if ((res.success)) {
              this.toastr.success(this.translate.instant('TOASTER_RESPONSE.PASSWORD_UPDATED_SUCCESS'));

                this.route.navigate(['/','playername',token]);
              }
          },
          (error:any)=>{
            if(error.error.message=='Token is required.'){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_TOKEN_REQUIRED'))
            }else if(error.error.message=='Password must be at least 8 characters long.'){
                this.toastr.error(this.translate.instant('SET_PASSWORD_PAGE.PASSWORD_LENGTH_ERROR'))
            }else if(error.error.message == 'Please enter valid password.'){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_INVALID_PASSWORD'))
            }else if(error.error.message=='Your session has expired. Please log in again.'){
              this.toastr.error(this.translate.instant("TOASTER_ERROR.ERROR_SESSION_EXPIRED"))
            }else{
              this.toastr.error(this.translate.instant('TOASTER_ERROR.SERVER_ERROR'))
            }
            this.toastr.error(error.error.message);
          });
      } else {
        this.toastr.error(this.translate.instant('TOASTER_RESPONSE.PASSWORDS_NOT_MATCH_ERROR'));



        this.passwordMismatchError = '';
      }

  } else {
    this.toastr.warning(
      this.translate.instant('TOASTER_RESPONSE.PASSWORD_VALIDATION_MESSAGE')
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
