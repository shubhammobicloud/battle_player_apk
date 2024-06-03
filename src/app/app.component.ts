import { Component, OnInit, Renderer2 } from '@angular/core';
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from './services/dashboard/dashboard.service';
import { ThemeSetterService } from './services/themeSetter/themeSetter.service';
import { environment } from 'src/environment/enviroment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'battlePlayerApp';
  backgroundStyle: any;
  url=environment.baseUrl
  constructor(public translate:TranslateService,
              private dashboardService:DashboardService,
              private themeSetter:ThemeSetterService
  ){
    let lang=localStorage.getItem('lang')
    if(lang)
translate.use(lang)
  }
  ngOnInit() {
      this.getTheme()
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('backButton', async () => {
        const confirm1 = await confirm(this.translate.instant('EXIT_APP'));
        if (confirm1) {
          CapacitorApp.exitApp();
        }
      });
    }
  }

  getTheme(){
      this.dashboardService.getEventImage().subscribe({
        next:(res:any)=>{
          console.log(res)
          this.applyPrimaryColor(res.data.themeColor)
          this.themeSetter.setLogoImage(res.data.avatar,res.data.eventName)
          this.backgroundStyle={
            'background-image':`url(${this.url}images/${res.data.bgAvatar})`,
          }
        }
      })
  }

  applyPrimaryColor(color: string) {
    document.documentElement.style.setProperty('--primary-color', color);

  }
}
