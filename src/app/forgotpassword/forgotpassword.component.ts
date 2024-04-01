import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent {
  forgotpassword: FormGroup = new FormGroup({
    email: new FormControl(''),
  });
  constructor(
    private http: HttpClient,
    private route: Router,
    private rouetrs: ActivatedRoute
  ) {}
  forgotpasswor() {
    // this.http
    //   .post(`${environment.baseUrl2}/forget-password/send-otp`, this.forgotpassword.value)
    //   .subscribe((res: any) => {
    //     console.log(res);
    //     if (res.message == 'Login successfully.',(this.rouetrs)) {
    //     localStorage.setItem('otp-email',this.forgotpassword.value.email)
    //       this.route.navigate(['/set-password/:_id']); // Navigate to OTP page using Router
    //     }
    //     console.log('Send Otp');
    //   });
    localStorage.setItem('otp-email', this.forgotpassword.value.email);
    this.route.navigate(['/set-password/:_id']);
  }
}
