import { Component, OnInit } from '@angular/core';
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'battlePlayerApp';
  ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('backButton', async () => {
        const confirm1 = await confirm('Exit App?');
        if (confirm1) {
          CapacitorApp.exitApp();
        }
      });
    }
  }
}
