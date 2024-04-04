import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "../header/header.service";
import { environment } from "src/environment/enviroment";

@Injectable({
    providedIn: 'root'
})
export class RankingService{

  private baseUrl = environment.baseUrl + 'ranking/'
  private httpOptions = this.headerService.updateHeader();
  constructor(
    private headerService: HeaderService,
    private toster: ToastrService,
    private http: HttpClient
) { }
    getMyTeamRanking = () =>{
  return this.http.get(this.baseUrl + 'my-team',this.httpOptions)
}
}
