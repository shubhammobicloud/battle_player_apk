import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getEventImage(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/one`);
  }

  getTeamImages(): Observable<any> {
    return this.http.get(`${environment.baseUrl}team/details`);
  }
}
