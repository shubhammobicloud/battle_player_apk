import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  menuItemClicked(action: string) {
    console.log('Menu item clicked:', action);
  }
  showProfileOption: boolean = false;
  userId!: string; // Assuming you have user ID available after authentication

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check current route to determine whether to show profile option
        this.showProfileOption = event.url.includes('/team');
      }
    });
  }
}
