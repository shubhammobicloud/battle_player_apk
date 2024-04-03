import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "../header/header.service";
import { environment } from "src/environment/enviroment";

@Injectable({
    providedIn: 'root'
})
export class TeamService {

  private baseUrl = environment.baseUrl + 'team/'
  private httpOptions = this.headerService.updateHeader();
  constructor(
    private headerService: HeaderService,
    private toster: ToastrService,
    private http: HttpClient
) { }
updateTeamImage = (data:any) =>{
  return this.http.patch(this.baseUrl + 'update',data,this.httpOptions)
}
}
