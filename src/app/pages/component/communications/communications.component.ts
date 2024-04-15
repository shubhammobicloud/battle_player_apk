import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.scss'],
})
export class CommunicationsComponent implements OnInit {
  showTeamChat: boolean = true;
  hidesuper: boolean = false;
  constructor(private http: HttpClient,private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const token: any = localStorage.getItem('token');

    let data: {
      _id: any;
      teamId: any;
      avatar: any;
      userName: any;
      superUser: boolean;
    } = jwtDecode(token);
    console.log('check', data.superUser);

    this.hidesuper = data.superUser;
    
    if (data.superUser) {
      this.showTeamChat = !this.showTeamChat;
  
    }
  }

  shouldShowTabsForUser(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      const userHasPermission = true;
      return userHasPermission;
    } else {
      return false;
    }
  }
}
