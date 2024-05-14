import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/users/users.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss'],
})
export class PlayerNameComponent {
  userName!: string;
  constructor(
    private active: ActivatedRoute,
    private route: Router,
    private toastr: ToastrService,
    private userService:UserService,
    public translate:TranslateService
  ) {

    let lang:any=localStorage.getItem('lang')
    translate.use(lang);
  }
  submit() {
    let token = this.active.snapshot.params['token'];
    if (this.userName) {
      let data = {
        userName: this.userName,
      };
      this.userService.updatePlayer(data)
        .subscribe((res: any) => {
          if (res.success) {
            localStorage.setItem('userName',res.data.userName)
            this.toastr.success(this.translate.instant('TOASTER_RESPONSE.USERNAME_SET_SUCCESS'));

            this.route.navigate(['/', 'playerimage', token]);
          }
        },
          (error)=>{
            if(error.error.message=='Invalid file type. Only Image allowed.'){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_INVALID_FILE_TYPE'));
            }else if(error.error.message=='Image size exceeds the limit. Please upload a smaller file that is less than 5MB.'){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_IMAGE_SIZE_EXCEEDS_LIMIT'))
            }else if(error.error.message=='Unauthorized'){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_UNAUTHORIZED'))

            }else{
              this.toastr.error(this.translate.instant('TOASTER_ERROR.SERVER_ERROR'))
            }
          }
      );
    }
  }
  back(){
    let token = this.active.snapshot.params['token'];
    this.route.navigate(['/', 'set-password', token]);
  }
}
