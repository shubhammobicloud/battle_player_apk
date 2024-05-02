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
            this.toastr.success('Username Set Successfully!!');
            this.route.navigate(['/', 'playerimage', token]);
          }
        });
    }
  }
}
