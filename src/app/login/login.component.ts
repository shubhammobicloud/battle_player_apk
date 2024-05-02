import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/users/users.service';
import {jwtDecode} from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{
  selectedLanguage = 'en';
languageCodes = ['en', 'de'];
  languages:any = {
    en: 'English',
    de: 'German',
  };

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    role:  new FormControl('user', Validators.required),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/),
      ],
    }),
  });
  hide = true;

  public showPassword: boolean = false;
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  constructor(
    private route: Router,
    private toastr: ToastrService,
    private userService:UserService,
    public translate:TranslateService
  ) {
    this.translate.addLangs(this.languageCodes);
  translate.setDefaultLang('en');
  translate.use('en');
  }
  ngOnInit(): void {
    this.translate.onLangChange.subscribe(event => {
      // Update localStorage with the new language
      localStorage.setItem('lang', event.lang);
    });
  }
  login() {
    if (this.loginForm.valid) {
     this.userService.signIn(this.loginForm.value).subscribe(
          (res: any) => {
            if (res.success) {
              localStorage.setItem('token', res.data.token);
              let data :{_id:any,teamId:any,avatar:any,userName:any,gameLeader:any}= jwtDecode(res.data.token);
              console.log(data )
              localStorage.setItem('userId', data._id);
              localStorage.setItem('teamId', data.teamId);
              localStorage.setItem('avatar',data.avatar)
              localStorage.setItem('userName',data.userName)
              localStorage.setItem('gameleader',data.gameLeader)
              // console.log("data", data)
              if (!res.data.firstLogin) {
                this.translate.get('TOASTER_RESPONSE.LOGIN_SUCCESS_MESSAGE').subscribe((translation: string) => {
                  this.toastr.success(translation);
                });
                sessionStorage.setItem('redirectFrom', 'login'); // Or 'forgot-password'
                this.route.navigate(['/', 'set-password', res.data.token]);
              } else {
                this.route.navigate(['/home']);
                this.translate.get('TOASTER_RESPONSE.LOGIN_SUCCESS_MESSAGE').subscribe((translation: string) => {
                  this.toastr.success(translation);
                });
              }
            }
          },(error)=>{
            if(error.error.message=='No matching data found. Please check your credentials and try again.'){
              this.translate.get('TOASTER_RESPONSE.NO_MATCHING_DATA_ERROR').subscribe((translation: string) => {
                this.toastr.error(translation);
              });
            }
            this.toastr.error(error.error.message)
          }

        );
    }else{
      this.translate.get('TOASTER_RESPONSE.FILL_DETAILS_ERROR').subscribe((translation: string) => {
        this.toastr.error(translation);
      });
    }
  }
}
