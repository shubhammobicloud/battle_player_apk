import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { HeaderService } from '../header/header.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyteamService {

  private baseUrl = environment.baseUrl + 'ranking/'
  private httpOptions = this.headerService.updateHeader();
  constructor(
    private headerService: HeaderService,
    private toster: ToastrService,
    private http: HttpClient
) { }
    getcompanyTeamRanking = () =>{
  return this.http.get(this.baseUrl + 'company-teams',this.httpOptions)
}
}
