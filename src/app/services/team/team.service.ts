import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private baseUrl = environment.baseUrl + 'team/';
  constructor(private http: HttpClient) {}
  updateTeamImage = (data: any) => {
    return this.http.patch(this.baseUrl + 'update', data);
  };

  getTeamDetails = () => {
    return this.http.get(this.baseUrl + 'details');
  };
}
