import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-team-score',
  templateUrl: './team-score.component.html',
  styleUrls: ['./team-score.component.scss'],
})
export class TeamScoreComponent {
  tableData!: any[];
  defaultId = 'YOUR_DEFAULT_ID_HERE';
  defaultIdCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<any[]>(`${environment.baseUrl}/ranking/my-team`, { headers })
      .subscribe(
        (data: any) => {
          this.tableData = data['data'];

          // Count occurrences of defaultId
          // this.defaultIdCount = this.countDefaultIdOccurrences(
          //   this.tableData,
          //   this.defaultId
          // );
          // console.log('Count of defaultId:', this.defaultIdCount);
        },
        (error) => {
          console.error('An error occurred:', error);
          // Handle error here
        }
      );
  }

  // countDefaultIdOccurrences(data: any[], defaultId: string): number {
  //   let count = 1;
  
  //   for (const item of data) {
  //     if (item.id === defaultId) {
  //       count++;
  //     }
  //   }
  
  //   return count;
  // }
}
