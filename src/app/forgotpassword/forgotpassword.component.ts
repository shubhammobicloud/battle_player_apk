import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent {
forgotpassword: FormGroup= new FormGroup({
  email: new FormControl('',),
})
constructor(private http:HttpClient){}
forgotpasswor(){
  this.http
  .post(`${environment.baseUrl2}/forget-password/send-otp`, this.forgotpassword.value).subscribe((res: any) => {
    console.log(res);
    if (res.message == 'Login successfully.') {
      localStorage.setItem('token', res.data)
    }
    console.log('Send Otp')
  });

}
}