import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  backgroundImageUrl!: any;
  constructor(public translate: TranslateService,private dashboardService:DashboardService, private http:HttpClient){
    let lang:any=localStorage.getItem('lang')
    translate.use(lang);
  }
ngOnInit(): void {
  this.getEventImage()
}

getEventImage() {
  this.dashboardService.getEventImage().subscribe({
    next: (res) => {
      console.log('api res', res);
      this.storeImageLocally(
      `${environment.baseUrl}images/${res.data.bgAvatar}`

      ).subscribe((res:any) => {
        console.log(URL.createObjectURL(res));
        this.backgroundImageUrl=URL.createObjectURL(res)
      });
    },
    error: (err: HttpErrorResponse) => {
      console.log('api error ', err);
    },
  });
}
storeImageLocally(imgUrl: string) {

  return this.http.get(imgUrl, { responseType: 'blob' }).pipe(take(1));
}
}
