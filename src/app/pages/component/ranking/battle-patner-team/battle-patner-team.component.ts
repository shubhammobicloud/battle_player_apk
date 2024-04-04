import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-battle-patner-team',
  templateUrl: './battle-patner-team.component.html',
  styleUrls: ['./battle-patner-team.component.scss']
})
export class BattlePatnerTeamComponent  implements OnInit{
  // tableData!: any[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.http.get<any[]>(`${environment.baseUrl}/ranking/my-team`).subscribe(data => {
    //   this.tableData = data;
    // });
  }
  myTeamList=[
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
  ]
}
