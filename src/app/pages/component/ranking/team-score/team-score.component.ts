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
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjA1MTQyMzMzYjMyZmM2ODAyMWJiYWIiLCJlbWFpbCI6ImRoaXJhai5tb2JpY2xvdWRAZ21haWwuY29tIiwidGVhbUlkIjoiNjVmOThiNDVmMGU2NDk4ZDcyYjY2YzdkIiwicm9sZSI6ImFkbWluIiwiY29tcGFueUlkIjoiNjVmMmI5YjM4NTM4ODg2OGRkNGQyNzU4IiwiaWF0IjoxNzExNjIyODgxLCJleHAiOjE3MTE3MDkyODF9.K2PL0EVzrih5kNPMg2qVRe4XY-iuJW7ZnZQ0bp5s9ag';
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // this.http.get<any[]>('http://192.168.29.223:3000/ranking/my-team',{ headers }).subscribe(data => {
    //   this.tableData = data;
    // });
  
  }
  myTeamList:any= [
    
    { name: 'Player 1', sales: 1, score: 85 },
    { name: 'Player 2', sales: 1, score: 75 },
    { name: 'Player 3', sales: 1, score: 65 },
    { name: 'Player 4', sales: 1, score: 55 },
    { name: 'Player 5', sales: 1, score: 45 },
    { name: 'Player 6', sales: 1, score: 45 },
    { name: 'Player 7', sales: 1, score: 45 },
    { name: 'Player 8', sales: 1, score: 45 },
    { name: 'Player 9', sales: 1, score: 45 },
    { name: 'Player 9', sales: 1, score: 45 },
    { name: 'Player 9', sales: 1, score: 45 },
    { name: 'Player 9', sales: 1, score: 45 },
  ];
}
