import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/enviroment';
import { ForgetPasswordService } from '../services/forgot-password/forgot-password.service';
import { ToastrService } from 'ngx-toastr';
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
    private toastr:ToastrService
  ) {}
  // forgotpasswor() {
  //   if (this.forgotpassword.valid) {
  //     this.forgerPasswordService.sendOtp({email: this.forgotpassword.value.email}).subscribe(
  //       (res: any) => {
  //         if ((res.message == "Otp sent sucessfully.")) {
  //           this.route.navigate(['/otp']);
  //         }
  //       });
  //     sessionStorage.setItem('redirectFrom', 'forgot password');
  //   } else {
  //     this.toastr.error('Form is invalid');
  //   }


  // }
  validateEmail(email: string) {
    const re = /^(([^<>()[\\]\\\\.,;:\s@"]+(\.[^<>()[\\]\\\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  submitEmail() {
    if (this.forgotPasswordForm.valid) {
      this.forgerPasswordService.sendOtp({email:this.forgotPasswordForm.value.email}).subscribe((res:any)=>{
        console.log(res)
        if(res.message=="Otp sent sucessfully."){
          this.toastr.success(res.message)
          this.showOtp = true;
          this.showPassword = true;
        }else{
          this.toastr.error("Invalid Email Id or Email Not Found");
        }
      },(error:any)=>{
        this.toastr.error(error.error.message)
      }
      )

    }
  }

  submitOtpAndPassword() {
    if (this.otp && this.password) {
      console.log(this.otp,this.password)
      this.forgerPasswordService.verifyOtp({
        email:this.forgotPasswordForm.value.email,
        otp: Number(this.otp),
        newPassword:this.password
      })
      .subscribe((res: any) => {
        console.log(res);
        if ((res.message == "Password updated successfully")) {
        this.toastr.success(res.message)
          this.route.navigate(['/'])
        }else{
          this.toastr.error('Invalid OTP')
        }
      });
    }
  }
}
