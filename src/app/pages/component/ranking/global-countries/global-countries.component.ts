import { Component } from '@angular/core';

@Component({
  selector: 'app-global-countries',
  templateUrl: './global-countries.component.html',
  styleUrls: ['./global-countries.component.scss']
})
export class GlobalCountriesComponent {
  tableHeader = ['Player Name'];
  myTeamList=[
    { name: 'Player 1', sales: 1, score: 85 },
    { name: 'Player 2', sales: 1, score: 75 },
    { name: 'Player 3', sales: 1, score: 65 },
    { name: 'Player 4', sales: 1, score: 55 },
    { name: 'Player 5', sales: 1, score: 45 },
    { name: 'Player 6', sales: 1, score: 45 },
    { name: 'Player 7', sales: 1, score: 45 },
    { name: 'Player 8', sales: 1, score: 45 },
    { name: 'Player 9', sales: 1, score: 45 },
    { name: 'Player 9', sales: 1, score: 45 },
    { name: 'Player 9', sales: 1, score: 45 },
    { name: 'Player 9', sales: 1, score: 45 },
  ]
}
