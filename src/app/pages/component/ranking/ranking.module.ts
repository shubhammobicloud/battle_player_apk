import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamScoreComponent } from './team-score/team-score.component';
import { CompanyUnitComponent } from './company-unit/company-unit.component';
import { GlobalCountriesComponent } from './global-countries/global-countries.component';
import { BattlePatnerTeamComponent } from './battle-patner-team/battle-patner-team.component';
import { CompanyTeamsComponent } from './company-teams/company-teams.component';
import { RankingComponent } from './ranking.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';

@NgModule({
  declarations: [
    TeamScoreComponent,RankingComponent,
    CompanyUnitComponent,NoDataFoundComponent,
    GlobalCountriesComponent,
    BattlePatnerTeamComponent,
    CompanyTeamsComponent,

  ],
  imports: [
    CommonModule,MatIconModule,    TranslateModule.forChild()
  ]
})
export class RankingModule { }
