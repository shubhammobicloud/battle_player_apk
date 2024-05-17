import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  constructor(
    public translate: TranslateService){


    let lang: any = localStorage.getItem('lang');
    translate.use(lang);

    }
}
