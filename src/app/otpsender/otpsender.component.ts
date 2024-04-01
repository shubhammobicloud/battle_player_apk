import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-otpsender',
  templateUrl: './otpsender.component.html',
  styleUrls: ['./otpsender.component.scss'],
})
export class OtpsenderComponent {
  otppassword: FormGroup = new FormGroup({
    otp: new FormControl(''),
  });
  otpbje = {
    email: localStorage.getItem('otp-email'),
    otp: localStorage.getItem('opt-verify'),
  };

  constructor(
    private http: HttpClient,
    private route: Router,
    private rouetrs: ActivatedRoute
  ) {}
  sendotpnumber() {
    console.log(this.otppassword)
    this.http
      .post(`${environment.baseUrl2}/forget-password/verify-otp`, {email:localStorage.getItem('otp-email'),otp:this.otppassword.value.otp})
      .subscribe((res: any) => {
        console.log(res);
        if ((res.message == 'Login successfully.', this.rouetrs)) {
          this.route.navigate(['set-password/:_id']);
        }
        console.log('Send Otp');
      });
  }
}
