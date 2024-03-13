import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  constructor(private http:HttpClient,private authService:AuthService){

  }
ngOnInit(): void {
      let id = this.authService.getUserIdFromToken()
      let teamId=localStorage.getItem('teamId')
      if(this.authService.gameLeader){
        this.http.get(environment.baseUrl+'sendMailToPlayer/'+teamId).subscribe((res)=>{
          console.log(res)
          })
      }
}
}
