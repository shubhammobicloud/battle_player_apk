import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamChatComponent } from './team-chat/team-chat.component';
import { CompanyNewsComponent } from './company-news/company-news.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NewspostComponent } from './newspost/newspost.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatBadgeModule } from '@angular/material/badge';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [TeamChatComponent, CompanyNewsComponent, NewspostComponent],
  imports: [
    CommonModule,MatInputModule,MatButtonModule,MatBadgeModule,MatMenuModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AngularEditorModule,
    TranslateModule.forChild(),
    InfiniteScrollModule
  ],
  exports: [TeamChatComponent, CompanyNewsComponent, NewspostComponent],
})
export class CommunicationsModule {}
