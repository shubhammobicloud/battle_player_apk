import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { jwtDecode } from 'jwt-decode';
import { NewsUpdateService } from 'src/app/services/news/newsUpdate.service';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.scss'],
})
export class CommunicationsComponent implements OnInit {
  currentItem: any;

  showTeamChat: boolean = true;
  hidesuper: boolean = false;
  constructor(private http: HttpClient,private elRef: ElementRef, private renderer: Renderer2, private updateNews:NewsUpdateService) {
    this.showTeamChat = updateNews.showTeamChat
  }

  ngOnInit(): void {
    const token: any = localStorage.getItem('token');

    let data: {
      _id: any;
      teamId: any;
      avatar: any;
      userName: any;
      superUser: boolean;
    } = jwtDecode(token);
    // console.log('check', data.superUser);

    this.hidesuper = data.superUser;
    // this.hidesuper=true

    if (data.superUser) {
      this.showTeamChat = !this.showTeamChat;


    }
  }

  handleUpdateParentState(value: any) {
    // console.log("calling ", value)
    this.showTeamChat = value;
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
