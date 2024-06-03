import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient,HttpParams  } from "@angular/common/http";
import { environment } from "src/environment/enviroment";
import { Observable, finalize } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ThemeSetterService{

  logoImagesSet:any
  eventTitle:any
  setLogoImage(logoimageName:any,eventTitle:string){
    this.logoImagesSet=logoimageName
    this.eventTitle=eventTitle
    localStorage.setItem('eventTitle',this.eventTitle)
    localStorage.setItem('logoImage',this.logoImagesSet)
  }

}
