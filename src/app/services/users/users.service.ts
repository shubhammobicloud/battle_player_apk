import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/enviroment";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private baseUrl = environment.baseUrl + 'user/'
    constructor(
        private http: HttpClient
    ) { }

    getUserProfile = () => {
        return this.http.get(this.baseUrl + 'get')
    }

    signIn = (data:any) =>{
        return this.http.post(this.baseUrl + 'signin',data)
    }

    updatePlayer = (data:any) =>{
      return this.http.patch(this.baseUrl + 'player-update',data)
  }
    setPassword = (data:any) =>{
      return this.http.patch(this.baseUrl + 'player-password',data)
    }
    getProfileDetails=()=>{
      return this.http.get(this.baseUrl+'details')
    }
    sendMailToPlayers=()=>{
      return this.http.get(this.baseUrl+'player-mail')
    }
}
