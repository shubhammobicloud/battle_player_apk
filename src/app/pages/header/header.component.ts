import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuOpen: boolean = false;

  // Method to toggle the menu
  toggleMenu(event: MouseEvent): void {
    event.stopPropagation(); // Prevent click event propagation
    this.isMenuOpen = !this.isMenuOpen;
  }
  //  this code is to close active menus in drop down in custome-menu drop down
  @HostListener('document:click', ['$event'])
  clickOutsideMenu(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest('.custom-menu') && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  menuItemClicked(action: string) {
    console.log('Menu item clicked:', action);
  }
  showProfileOption: boolean = false;
  userId!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check current route to determine whether to show profile option
        this.showProfileOption = event.url.includes('/home/profile');
      }
    });
  }
  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }
}
