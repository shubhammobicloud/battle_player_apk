import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-global-countries',
  templateUrl: './global-countries.component.html',
  styleUrls: ['./global-countries.component.scss']
})
export class GlobalCountriesComponent {
  tableData!: any[];
  defaultId = 'YOUR_DEFAULT_ID_HERE';
  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<any[]>(`${environment.baseUrl}ranking/companies`, { headers })
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
