import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isActiveButton: string | null = null;
  constructor(private router: Router) { }

  ngOnInit(): void { }

  onButtonClick(path: string): void {
    this.isActiveButton = path;
    this.router.navigate(['home', path]);
  }
}
