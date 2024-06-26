import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { pipe } from 'rxjs';
import { RankingService } from 'src/app/services/ranking/ranking.service';

import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-global-countries',
  templateUrl: './global-countries.component.html',
  styleUrls: ['./global-countries.component.scss']
})
export class GlobalCountriesComponent {
  tableData!: any[];
  defaultId = 'YOUR_DEFAULT_ID_HERE';
  defaultIdCount = 0;
  noData:boolean=false
// this code is relate to flag
  icon(name:string):string {
    let name1 = name.toLowerCase()
    return `fi fi-${name1}`;
  }


  constructor(private http: HttpClient,private rankingService:RankingService) {}

  ngOnInit(): void {

    this.rankingService.getglobalRanking().subscribe((data: any) => {
          this.tableData = data['data'].sort((a:any,b:any)=>b.rankingScore-a.rankingScore);
          if(this.tableData.length==0){
            this.noData=true
          }
          // console.log(data)
          // debugger
// this.getFlagUrl.name

        },
        (error:any) => {
          console.error('An error occurred:', error);
          // Handle error here
        }
      );
}
// getIconClass(name: string): string {
//   return `fi fi-in`;
// }

getFlagUrl(flagName: string): string {
  return this.rankingService.getFlagUrl(flagName);
}
}
