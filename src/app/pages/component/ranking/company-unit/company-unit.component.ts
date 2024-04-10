import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RankingService } from 'src/app/services/ranking/ranking.service';

import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-company-unit',
  templateUrl: './company-unit.component.html',
  styleUrls: ['./company-unit.component.scss']
})
export class CompanyUnitComponent {
  tableData!: any[];
  defaultId = 'YOUR_DEFAULT_ID_HERE';
  defaultIdCount = 0;

  constructor(private http: HttpClient,private rankingService:RankingService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.rankingService.getcompanyuintRanking()
      .subscribe(
        (data: any) => {
          this.tableData = data['data'];

          
        },
        (error:any) => {
          console.error('An error occurred:', error);
          // Handle error here
        }
      );
  }
}
