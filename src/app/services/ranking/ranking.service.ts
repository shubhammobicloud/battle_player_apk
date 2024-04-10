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
// team Score
    getMyTeamRanking = () =>{
  return this.http.get(this.baseUrl + 'my-team',this.httpOptions)
}
// Company Team
getcompanyTeamRanking = () =>{
  return this.http.get(this.baseUrl + 'company-teams',this.httpOptions)
}

// Global Ranking
getglobalRanking = () =>{
  return this.http.get(this.baseUrl + 'companies',this.httpOptions)
}

// company Unit 
getcompanyuintRanking = () =>{
  return this.http.get(this.baseUrl + 'units',this.httpOptions)
}


getbattleteamRanking = () =>{
  return this.http.get(this.baseUrl + 'battle-team',this.httpOptions)
}
}
