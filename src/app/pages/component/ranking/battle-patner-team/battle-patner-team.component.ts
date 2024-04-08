import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-battle-patner-team',
  templateUrl: './battle-patner-team.component.html',
  styleUrls: ['./battle-patner-team.component.scss']
})
export class BattlePatnerTeamComponent  implements OnInit{
  tableData!: any[];
  defaultId = 'YOUR_DEFAULT_ID_HERE';
  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<any[]>(`${environment.baseUrl}ranking/battle-team`, { headers } , )
      .subscribe(
        (data: any) => {
          this.tableData = data['data'];

          
        },
        (error) => {
          console.error('An error occurred:', error);
          // Handle error here
        }
      );
  }
}
