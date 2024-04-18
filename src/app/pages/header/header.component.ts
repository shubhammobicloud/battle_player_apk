import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit{
  isMenuOpen = false;
  showTeamChat: boolean = true;
  hidesuper: boolean = false;
  // showPope = false;
  showPopes(event: MouseEvent) {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Method to toggle the menu
  toggleMenu(event: any): void {
    event.stopPropagation(); 
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

  constructor(private router: Router,private toastr:ToastrService ,) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check current route to determine whether to show profile option
        this.showProfileOption = event.url.includes('/home/profile');
      }
    });


    const token: any = localStorage.getItem('token');

    let data: {
      _id: any;
      teamId: any;
      avatar: any;
      userName: any;
      superUser: boolean;
    } = jwtDecode(token);
    console.log('check', data.superUser);

    this.hidesuper = data.superUser;
    
    if (data.superUser) {
      this.showTeamChat = !this.showTeamChat;
      
  
    }
  }
  logOut() {
    // this.showPope = true;
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    this.toastr.success('Logout successfully.');

  }
  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }
}
