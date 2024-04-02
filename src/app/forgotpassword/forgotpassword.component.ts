import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent {
  forgotpassword: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ],
    }),
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



    if (this.forgotpassword.valid) {
      localStorage.setItem('otp-email', this.forgotpassword.value.email);
      // Assuming you have imported Router from '@angular/router'
      
      this.route.navigate(['/set-password/:_id']);
    } else {
      // Handle invalid form
      console.log('Form is invalid');
      // You can also display an error message to the user
    }
  
    
  }
}
