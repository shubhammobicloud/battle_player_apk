import { Component, OnInit } from '@angular/core';
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'battlePlayerApp';
  constructor(public translate:TranslateService){
    let lang=localStorage.getItem('lang')
    if(lang)
translate.use(lang)
  }
  ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('backButton', async () => {
        const confirm1 = await confirm(this.translate.instant('EXIT_APP'));
        if (confirm1) {
          CapacitorApp.exitApp();
        }
      });
    }
  }
}
