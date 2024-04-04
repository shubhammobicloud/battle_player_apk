import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "../header/header.service";
import { environment } from "src/environment/enviroment";

@Injectable({
    providedIn: 'root'
})
export class NewsSerives{

  private baseUrl = environment.baseUrl + 'news/'
  private httpOptions = this.headerService.updateHeader();
  constructor(
    private headerService: HeaderService,
    private toster: ToastrService,
    private http: HttpClient
) { }
    getNews = () =>{
        return this.http.get(this.baseUrl,this.httpOptions)
    }

    reactOnNews=()=>{
      return this.http.get(this.baseUrl+'react',this.httpOptions);
    }
}
