import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages.component';
import { ScoreBoardComponent } from '../../component/score-board/score-board.component';
import { ProfileComponent } from '../../component/profile/profile.component';
import { RankingComponent } from '../../component/ranking/ranking.component';
import { CommunicationsComponent } from '../../component/communications/communications.component';
import { TeamDetailsComponent } from '../../component/team-details/team-details.component';

const routes: Routes = [
  {
    path: 'home',
    component: PagesComponent,
    children: [
      { path: '',redirectTo:'mybattle',pathMatch:'full' },
      { path: 'mybattle', component: ScoreBoardComponent },
      { path: 'ranking', component: RankingComponent},
      { path: 'communications', component: CommunicationsComponent },
      { path: 'profile', component: ProfileComponent },
      {path:'Team-profile',component:TeamDetailsComponent}
    ]
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
