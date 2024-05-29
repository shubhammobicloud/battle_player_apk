import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RankingService } from 'src/app/services/ranking/ranking.service';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-battle-patner-team',
  templateUrl: './battle-patner-team.component.html',
  styleUrls: ['./battle-patner-team.component.scss']
})
export class BattlePatnerTeamComponent  implements OnInit{
  tableData!: any[];
  link = environment.baseUrl;
  noData: boolean=false;
  constructor(private rankingService:RankingService) {}

  ngOnInit(): void {

    this.rankingService.getbattleteamRanking()
      .subscribe({
        next:(data: any) => {
          this.tableData = data['data'].sort((a:any,b:any)=>b.rankingScore-a.rankingScore);
          if(this.tableData.length==0){
            this.noData=true
          }
        },
        error:(error:any) => {
          console.error('An error occurred:', error);
          // Handle error here
        }
  });
  }
}
