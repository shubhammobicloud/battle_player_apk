import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "../header/header.service";
import { environment } from "src/environment/enviroment";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private baseUrl = environment.baseUrl + '/user/'
    private httpOptions = this.headerService.updateHeader();
    constructor(
        private headerService: HeaderService,
        private toster: ToastrService,
        private http: HttpClient
    ) { }

    getUserProfile = () => {
        return this.http.get(this.baseUrl + 'get',this.httpOptions)
    }

    signIn = (data:any) =>{
        return this.http.post(this.baseUrl + 'signin',data)
    }

    updatePlayer = (data:any) =>{
      return this.http.patch(this.baseUrl + 'player-update',data,this.httpOptions)
  }
    setPassword = (data:any) =>{
      return this.http.patch(this.baseUrl + 'player-password',data)
    }

}
