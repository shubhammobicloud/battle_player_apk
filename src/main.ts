import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/ngsw-worker.js')
  //     .then(() => console.log('Service Worker registered successfully'))
  //     .catch(error => console.error('Service Worker registration failed:', error));
  // }
