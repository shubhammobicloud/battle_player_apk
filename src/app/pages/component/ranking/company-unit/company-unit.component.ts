import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-company-unit',
  templateUrl: './company-unit.component.html',
  styleUrls: ['./company-unit.component.scss']
})
export class CompanyUnitComponent {
  tableData!: any[];
  defaultId = 'YOUR_DEFAULT_ID_HERE';
  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<any[]>(`${environment.baseUrl}ranking/units`, { headers })
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
