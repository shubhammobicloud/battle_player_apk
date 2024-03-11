import { Component } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {
  activeTab = 'My Team'; // Initially set active tab

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }


}
