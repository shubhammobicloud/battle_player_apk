import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { environment } from 'src/environment/enviroment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import {  Router } from '@angular/router';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  backgroundImageUrl!: any;
  isActiveButton: string | null = null;
  constructor(
    public translate: TranslateService,
    private dashboardService: DashboardService,
    private http: HttpClient,
    private router:Router,
    private toast:ToastrService
  ) {
    let lang: any = localStorage.getItem('lang');
    translate.use(lang);
  }
  ngOnInit(): void {
    if(localStorage.getItem("activePage")){
      this.isActiveButton=localStorage.getItem("activePage")
    }else{
      this.isActiveButton='mybattle'
    }
  }

  getEventImage() {
    this.dashboardService.getEventImage().subscribe({
      next: (res) => {
        console.log('api res', res);
        this.storeImageLocally(
          `${environment.baseUrl}images/${res.data.bgAvatar}`
        ).subscribe((res: any) => {
          console.log(URL.createObjectURL(res));
          this.backgroundImageUrl = URL.createObjectURL(res);
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

  onButtonClick(path: string): void {
    this.isActiveButton = path;
    localStorage.setItem("activePage",this.isActiveButton)
    this.router.navigate(['home', path]);
  }
  logOut(): void {
    // this.isActiveButton = 'logOut';
    this.translate.get(['LOGOUT_POPUP.CONFIRM_LOGOUT', 'LOGOUT_POPUP.LOGOUT_CONFIRMATION', 'LOGOUT_POPUP.YES', 'LOGOUT_POPUP.NO', 'LOGOUT_POPUP.LOGOUT_SUCCESS']).subscribe(translations => {
      Swal.fire({
        title: translations['LOGOUT_POPUP.CONFIRM_LOGOUT'],
        text: translations['LOGOUT_POPUP.LOGOUT_CONFIRMATION'],
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: translations['LOGOUT_POPUP.YES'],
        confirmButtonColor: '#cc0000',
        cancelButtonText: translations['LOGOUT_POPUP.NO'],
      }).then((result:any) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          this.router.navigate(['/']);
          this.toast.success(translations['LOGOUT_POPUP.LOGOUT_SUCCESS']);
          localStorage.removeItem("activePage")
        }
      });
    });
  }
}
