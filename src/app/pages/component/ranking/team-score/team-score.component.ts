import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RankingService } from 'src/app/services/ranking/ranking.service';
import { environment } from 'src/environment/enviroment';
@Component({
  selector: 'app-team-score',
  templateUrl: './team-score.component.html',
  styleUrls: ['./team-score.component.scss'],
})
export class TeamScoreComponent {
  tableData!: any[];
  link = environment.baseUrl;
  noData:boolean=false
  constructor(private http: HttpClient,private rankingService:RankingService) {}

  ngOnInit(): void {
    // this.rankingService.getMyTeamRanking()
    //   .subscribe(
    //     (data: any) => {
    //       this.tableData = data['data'].sort((a:any,b:any)=>b.rankingScore-a.rankingScore);
    //     },
    //     (error:any) => {
    //       console.error('An error occurred:', error);
    //       // Handle error here
    //     }
    //   );
    this.rankingService.getMyTeamRanking().subscribe({
      next:(res)=>{
        this.tableData = res['data'].sort((a:any,b:any)=>b.rankingScore-a.rankingScore);
        if(this.tableData.length==0){
          this.noData=true
        }
      },
      error:(error)=>{
        console.error('An error occurred:', error);
      }
    })
  }


}
