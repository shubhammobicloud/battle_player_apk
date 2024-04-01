import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/enviroment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  passwordMismatchError: string = ''; // New variable to hold password mismatch error message
  constructor(private http:HttpClient,private router:ActivatedRoute,private route:Router,private toastr:ToastrService){

  }
  setPassword(): void {
     // Check if passwords match
   let validatePass = this.validatePassword(this.password)
   let _id=this.router.snapshot.params['_id']
   console.log(validatePass)
    if(validatePass){

      if (this.password !== this.confirmPassword) {
       this.passwordMismatchError = 'Passwords do not match. Please try again.';
        this.toastr.error(this.passwordMismatchError)
       return;
     } else {
       this.passwordMismatchError = '';
     }
     let data ={
       password:this.confirmPassword,
       _id:_id,
       firstLogin:true
   }
     this.http.patch(environment.baseUrl+'/user/admin-password',data).subscribe(
       (response:any) => {
         console.log('API Response:', response);
         if(response.message=="password updated successfully..."){
          this.toastr.success('Password set successful')
           this.route.navigate(['/','playername',_id])
         }

       },
       (error:any) => {
         console.error('API Error:', error);
         // Handle error, e.g., show an error message
       }
     );
    }else{
      alert("Password Should Be At Least Of Minimun 8 Character, Must Contain Number And Alphabets")
    }
  }



  validatePassword(password: string): boolean {
    // Customize your password validation criteria
    const minLength = 8;
    const containsLettersAndNumbers = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

    return password.length >= minLength && containsLettersAndNumbers.test(password);
  }
}
