import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient,HttpParams  } from "@angular/common/http";
import { environment } from "src/environment/enviroment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RankingService{

  private baseUrl = environment.baseUrl + 'ranking/'
  constructor(
    private toster: ToastrService,
    private http: HttpClient
) { }


// team Score
    getMyTeamRanking = () =>{
  return this.http.get(this.baseUrl + 'my-team',)
}
// Company Team
getcompanyTeamRanking = () =>{
  return this.http.get(this.baseUrl + 'company-teams')
}
getTeamRankingOfTwoTeams(teamId: string, battlePartnerTeamId: string): Observable<any> {
  // Set up the URL with parameters
  const url = `${this.baseUrl}company-teams`;

  // Set up the parameters
  const params = new HttpParams()
    .set('teamId', teamId)
    .set('battlePartnerTeamId', battlePartnerTeamId);

  // Make the GET request with parameters
  return this.http.get(url, { params });
}
// Global Ranking
getglobalRanking = () =>{
  return this.http.get(this.baseUrl + 'companies')
}

// company Unit
getcompanyuintRanking = () =>{
  return this.http.get(this.baseUrl + 'units')
}


getbattleteamRanking = () =>{
  return this.http.get(this.baseUrl + 'battle-team')
}



private flagMap(flagName: string): string{
  return `fi fi-in`;
  // Add more flag mappings as needed
}


getFlagUrl(flagName: string): string {
  return this.flagMap.prototype
}
}
