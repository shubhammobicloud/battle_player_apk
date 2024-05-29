import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpClient,HttpParams  } from "@angular/common/http";
import { environment } from "src/environment/enviroment";
import { Observable, finalize } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class RankingService{

  private baseUrl = environment.baseUrl + 'ranking/'
  constructor(
    private toster: ToastrService,
    private http: HttpClient,
    public translate:TranslateService
) {
  // translate.use('de')\/\
}


// team Score
    getMyTeamRanking = () =>{
      const loadingToast = this.toster.info('',this.translate.instant('LOADING_DATA'), {
        disableTimeOut: true,
        closeButton: true,
        positionClass: 'toast-top-right'
      });

      return this.http.get<any>(this.baseUrl +'my-team')
        .pipe(
          finalize(() => {
            if (loadingToast) {
              this.toster.clear(loadingToast.toastId);
            }
          })
        );
}
// Company Team
getcompanyTeamRanking = () =>{
  const loadingToast = this.toster.info('',this.translate.instant('LOADING_DATA'), {
    disableTimeOut: true,
    closeButton: true,
    positionClass: 'toast-top-right'
  });
  return this.http.get(this.baseUrl + 'company-teams').pipe(
    finalize(() => {
      if (loadingToast) {
        this.toster.clear(loadingToast.toastId);
      }
    })
  );
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
  const loadingToast = this.toster.info('',this.translate.instant('LOADING_DATA'), {
    disableTimeOut: true,
    closeButton: true,
    positionClass: 'toast-top-right'
  });
  return this.http.get(this.baseUrl + 'companies').pipe(
    finalize(() => {
      if (loadingToast) {
        this.toster.clear(loadingToast.toastId);
      }
    })
  );
}

// company Unit
getcompanyuintRanking = () =>{
  const loadingToast = this.toster.info('',this.translate.instant('LOADING_DATA'), {
    disableTimeOut: true,
    closeButton: true,
    positionClass: 'toast-top-right'
  });
  return this.http.get(this.baseUrl + 'units').pipe(
    finalize(() => {
      if (loadingToast) {
        this.toster.clear(loadingToast.toastId);
      }
    })
  );
}


getbattleteamRanking = () =>{
  const loadingToast = this.toster.info('',this.translate.instant('LOADING_DATA'), {
    disableTimeOut: true,
    closeButton: true,
    positionClass: 'toast-top-right'
  });
  return this.http.get(this.baseUrl + 'battle-team').pipe(
    finalize(() => {
      if (loadingToast) {
        this.toster.clear(loadingToast.toastId);
      }
    })
  );
}



private flagMap(flagName: string): string{
  return `fi fi-in`;
  // Add more flag mappings as needed
}


getFlagUrl(flagName: string): string {
  return this.flagMap.prototype
}
}
