import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/enviroment";

@Injectable({
    providedIn: 'root'
})
export class NewsSerives{

  private baseUrl = environment.baseUrl + 'news/'
  constructor(
    private toster: ToastrService,
    private http: HttpClient
) { }
    getNews = () =>{
        return this.http.get(this.baseUrl)
    }

    reactOnNews=(Id:any)=>{
      return this.http.put(this.baseUrl+'react/'+Id,'');
    }
}
