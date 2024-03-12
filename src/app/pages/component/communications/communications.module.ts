import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamChatComponent } from './team-chat/team-chat.component';
import { CompanyNewsComponent } from './company-news/company-news.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [

    TeamChatComponent,
     CompanyNewsComponent,
  ],
  imports: [
    CommonModule,MatIconModule,FormsModule
  ],
  exports:[
    TeamChatComponent,
    CompanyNewsComponent
  ]
})
export class CommunicationsModule { }
