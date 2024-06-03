import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environment/enviroment';
import { ThemeSetterService } from '../services/themeSetter/themeSetter.service';
import { DashboardService } from '../services/dashboard/dashboard.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  url = environment.baseUrl;
  logoImage: any;
  eventName: string = '';
  constructor(
    public translate: TranslateService,
    private dashboardService: DashboardService
  ) {
    let lang: any = localStorage.getItem('lang');
    translate.use(lang);
  }
  ngOnInit(): void {
    let logoImage = localStorage.getItem('logoImage');
    let eventTitle = localStorage.getItem('eventTitle');
    this.dashboardService.getEventImage().subscribe({
      next: (res) => {
        if (logoImage && logoImage == res.data.avatar) {
          this.logoImage = logoImage;
        } else {
          this.logoImage = res.data.avatar;
        }
        if (eventTitle && eventTitle == res.data.eventName) {
          this.eventName = eventTitle;
        } else {
          this.eventName = res.data.eventName;
        }
      },
    });
  }
}
