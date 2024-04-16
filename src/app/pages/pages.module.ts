import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetStartedComponent } from '../get-started/get-started.component';
import { TeamNameComponent } from '../team-name/team-name.component';
import { TeamImageComponent } from '../team-image/team-image.component';
import { ScoreBoardComponent } from './component/score-board/score-board.component';
import { CommunicationsComponent } from './component/communications/communications.component';
import { ProfileComponent } from './component/profile/profile.component';
import { TeamDetailsComponent } from './component/team-details/team-details.component';
import { PageRoutingModule } from './modules/routing/pages-routing.module';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PagesComponent } from './pages.component';
import { MenuComponent } from './menu/menu.component';
import { PageMaterialModule } from './modules/material/page-material.module';
import { RankingModule } from './component/ranking/ranking.module';
import { CommunicationsModule } from './component/communications/communications.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NewspostComponent } from './component/communications/newspost/newspost.component';
@NgModule({
  declarations: [
    GetStartedComponent,
    PagesComponent,
    TeamNameComponent,
    TeamImageComponent,
    ScoreBoardComponent,
    CommunicationsComponent,
    ProfileComponent,
    HeaderComponent,
    MenuComponent,
    TeamDetailsComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    PageMaterialModule,
    RankingModule,
    CommunicationsModule,
    ReactiveFormsModule,
    PageRoutingModule,
    MatMenuModule,
    MatIconModule,
  ],
})
export class PagesModule {}
