import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
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
