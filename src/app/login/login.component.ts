import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/enviroment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm=new FormGroup({
      email:new  FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
  })

  constructor(private fb: FormBuilder,private http:HttpClient) {
  }

  login() {
   if(this.loginForm.valid){
    this.http.post(`${environment.baseUrl}playerLogin`,this.loginForm.value).subscribe(res=>{
      console.log(res)
    })
   }


  }
}
