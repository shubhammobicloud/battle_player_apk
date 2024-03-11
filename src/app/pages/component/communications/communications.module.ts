import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamChatComponent } from './team-chat/team-chat.component';
import { CompanyNewsComponent } from './company-news/company-news.component';



@NgModule({
  declarations: [

    TeamChatComponent,
     CompanyNewsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CommunicationsModule { }
