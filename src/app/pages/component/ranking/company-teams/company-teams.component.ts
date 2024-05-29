import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RankingService } from 'src/app/services/ranking/ranking.service';

import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-company-teams',
  templateUrl: './company-teams.component.html',
  styleUrls: ['./company-teams.component.scss']
})
export class CompanyTeamsComponent {
  tableData!: any[];
  link = environment.baseUrl;
  noData:boolean=false;
  constructor(private http: HttpClient,private rankingService:RankingService) {}

  ngOnInit(): void {
    this.rankingService.getcompanyTeamRanking()
      .subscribe(
        (data: any) => {
          this.tableData = data['data'].sort((a:any,b:any)=>b.rankingScore-a.rankingScore);
          if(this.tableData.length==0){
            this.noData=true
          }

        },
        (error:any) => {
          console.error('An error occurred:', error);
          // Handle error here
        }
      );
  }

  formatRankingScore(score: number): string {
    if (score !== null && score !== undefined) {
      // Convert score to string
      let scoreString = score.toString();

      // Remove decimal point and trailing zeros
      scoreString = scoreString.replace(/(\.0+|\.)/g, "");

      // Append "%" symbol
      return scoreString + "%";
    } else {
      // If score is null or undefined, return "0%"
      return "0%";
    }
  }
}


