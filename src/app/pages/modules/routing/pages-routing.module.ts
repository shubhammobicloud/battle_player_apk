import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages.component';
import { ScoreBoardComponent } from '../../component/score-board/score-board.component';
import { ProfileComponent } from '../../component/profile/profile.component';
import { RankingComponent } from '../../component/ranking/ranking.component';
import { CommunicationsComponent } from '../../component/communications/communications.component';
import { TeamDetailsComponent } from '../../component/team-details/team-details.component';
import { NewspostComponent } from '../../component/communications/newspost/newspost.component';
import { AuthGuardService as authGuard } from 'src/app/services/auth guard/auth-guard.service';
const routes: Routes = [
  {
    path: 'home',
    component: PagesComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'mybattle', pathMatch: 'full' },
      { path: 'mybattle',canActivate: [authGuard], component: ScoreBoardComponent },
      { path: 'ranking', canActivate: [authGuard],component: RankingComponent },
      { path: 'newspost',canActivate: [authGuard], component: NewspostComponent },
      { path: 'communications',canActivate: [authGuard], component: CommunicationsComponent },
      { path: 'profile',canActivate: [authGuard], component: ProfileComponent },
      { path: 'Team-profile', canActivate: [authGuard],component: TeamDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
