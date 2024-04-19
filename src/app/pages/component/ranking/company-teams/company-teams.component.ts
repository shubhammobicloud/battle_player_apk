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

  constructor(private http: HttpClient,private rankingService:RankingService) {}

  ngOnInit(): void {
    this.rankingService.getcompanyTeamRanking()
      .subscribe(
        (data: any) => {
          this.tableData = data['data'].sort((a:any,b:any)=>b.rankingScore-a.rankingScore);


        },
        (error:any) => {
          console.error('An error occurred:', error);
          // Handle error here
        }
      );
  }
}


