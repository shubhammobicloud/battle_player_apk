import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.scss']
})
export class CommunicationsComponent  implements OnInit{
  showTeamChat: boolean = true; // Initially show Team Chat
  hidesuper:boolean=false
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token:any = localStorage.getItem('token');

    let data: {
      _id: any;
      teamId: any;
      avatar: any;
      userName: any;
      superUser: boolean;
    } = jwtDecode(token);
    console.log('check', data.superUser);

    
    this.hidesuper = data.superUser
  if(data.superUser){

    this.showTeamChat=!this.showTeamChat
  }
  }

  shouldShowTabsForUser(): boolean {
    const token = localStorage.getItem('token'); // Retrieve token here

    if (token) {
      // Token is present, you can perform authorization checks here
      // For demonstration purposes, let's assume userHasPermission is true
      const userHasPermission = true; // Replace with your actual logic
      return userHasPermission;
    } else {
      // Token is not present, user doesn't have permission
      return false;
    }
  }
}
