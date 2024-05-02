import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPasswordService } from '../services/forgot-password/forgot-password.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environment/enviroment';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent {
  email: string = '';
  otp!: number;
  password: string = '';
  showOtp: boolean = false;
  showPassword: boolean = false;
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private http: HttpClient,
    private route: Router,
    private forgerPasswordService: ForgetPasswordService,
    private rouetrs: ActivatedRoute,
    private toastr:ToastrService,
    public translate:TranslateService
  ) {
    let lang:any=localStorage.getItem('lang')
    translate.use(lang);
  }

  validateEmail(email: string) {
    const re = /^(([^<>()[\\]\\\\.,;:\s@"]+(\.[^<>()[\\]\\\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  submitEmail() {
    if (this.forgotPasswordForm.valid) {
      this.forgerPasswordService.sendOtp({email:this.forgotPasswordForm.value.email}).subscribe((res:any)=>{
        if(res.success){
          this.toastr.success(this.translate.instant('TOASTER_RESPONSE.OTP_SENT_SUCCESSFULLY'));
          this.showOtp = true;
          this.showPassword = true;
        }else{
          this.translate.get('TOASTER_RESPONSE.INVALID_EMAIL_ERROR').subscribe((translation: string) => {
            this.toastr.error(translation);
          });
        }
      },(error:any)=>{
        this.toastr.error(error.error.message)
      }
      )

    }else if(this.forgotPasswordForm.get('email')?.hasError('required')){
      this.translate.get('TOASTER_RESPONSE.EMAIL_REQUIRED_WARNING').subscribe((translation: string) => {
        this.toastr.warning(translation);
      });
    } else {
      this.translate.get('TOASTER_RESPONSE.INVALID_EMAIL_WARNING').subscribe((translation: string) => {
        this.toastr.warning(translation);
      });
    }

  }

  submitOtpAndPassword() {
    if (this.otp && this.password) {
      if(this.validatePassword(this.password)){
      console.log(this.otp,this.password)
      this.forgerPasswordService.verifyOtp({
        email:this.forgotPasswordForm.value.email,
        otp: Number(this.otp),
        newPassword:this.password
      })
      .subscribe((res: any) => {
        console.log(res);
        if ((res.success)) {
        this.toastr.success(this.translate.instant('TOASTER_RESPONSE.PASSWORD_UPDATED_SUCCESSFULLY'))
          this.route.navigate(['/'])
        }
      },(error)=>{
        this.toastr.error(error.error.message)
      });
    }else{
      this.toastr.warning(
        this.translate.instant('TOASTER_RESPONSE.PASSWORD_VALIDATION_MESSAGE')
      );
    }
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
}
