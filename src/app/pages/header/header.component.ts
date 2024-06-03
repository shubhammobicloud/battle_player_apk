import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeSetterService } from 'src/app/services/themeSetter/themeSetter.service';
import { environment } from 'src/environment/enviroment';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private themeSetter: ThemeSetterService,
    private dashboardService:DashboardService
  ) {}
  eventTitle: any;
  url = environment.baseUrl;

  logoImage: any;
  ngOnInit(): void {
    let logoImage = localStorage.getItem('logoImage');
    let eventTitle = localStorage.getItem('eventTitle')
    this.dashboardService.getEventImage().subscribe({
      next:(res)=>{
        if( logoImage && logoImage==res.data.avatar){
          this.logoImage=logoImage
        }else{
          this.logoImage=res.data.avatar
        }
        if(eventTitle && eventTitle == res.data.eventName){
          this.eventTitle=eventTitle
        }else{
          this.eventTitle=res.data.eventName
        }
      }
    })
  }
  routeToHome() {
    this.router.navigate(['/', 'home']);
    localStorage.setItem('activePage', 'mybattle');
    this.router.navigate(['home']);
  }
}
