import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.scss'],
})
export class CommunicationsComponent implements OnInit {
  showTeamChat: boolean = true;

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  shouldShowTabsForUser(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      const userHasPermission = false;
      return userHasPermission;
    } else {
      return false;
    }
  }
}
