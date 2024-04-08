import { Injectable } from '@angular/core';
import { HeaderService } from '../header/header.service';
import { environment } from 'src/environment/enviroment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompainesService {



  private baseUrl = environment.baseUrl + 'ranking/'
  private httpOptions = this.headerService.updateHeader();
  constructor(
    private headerService: HeaderService,
    private toster: ToastrService,
    private http: HttpClient
) { }
    getglobalRanking = () =>{
  return this.http.get(this.baseUrl + 'companies',this.httpOptions)
}
}
