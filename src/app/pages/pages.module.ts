import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreBoardComponent } from './component/score-board/score-board.component';
import { CommunicationsComponent } from './component/communications/communications.component';
import { ProfileComponent } from './component/profile/profile.component';
import { TeamDetailsComponent } from './component/team-details/team-details.component';
import { PageRoutingModule } from './modules/routing/pages-routing.module';
import {  RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PagesComponent } from './pages.component';
import { MenuComponent } from './menu/menu.component';
import { PageMaterialModule } from './modules/material/page-material.module';
import { RankingModule } from './component/ranking/ranking.module';
import { CommunicationsModule } from './component/communications/communications.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    PagesComponent,
    ScoreBoardComponent,
    CommunicationsComponent,
    ProfileComponent,
    HeaderComponent,
    MenuComponent,
    TeamDetailsComponent
  ],
  imports: [
    CommonModule,DragDropModule,
    RouterModule,
    PageMaterialModule,
    RankingModule,
    CommunicationsModule,
    ReactiveFormsModule,
    PageRoutingModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule.forChild(),
  ],providers:[TranslateService]
})
export class PagesModule {}
