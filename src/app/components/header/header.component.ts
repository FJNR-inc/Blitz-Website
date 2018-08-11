import { Component, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {

    responsive = false;
    dropdownOpened = [];
    profile: User;

    constructor(private authenticationService: AuthenticationService) {
      this.profile = this.authenticationService.getProfile();
      this.authenticationService.profile.subscribe(
        profile => this.profile = profile
      );
    }

    closeResponsiveNavbar() {
      this.responsive = false;
      this.dropdownOpened = [];
    }

    toogleResponsiveNavbar() {
      if (this.responsive) {
        this.closeResponsiveNavbar();
      } else {
        this.responsive = true;
      }
    }

    isAuthenticated() {
      return this.authenticationService.isAuthenticated();
    }

    closeDropdown(name: string) {
      const index = this.dropdownOpened.indexOf(name, 0);
      if (index > -1) {
        this.dropdownOpened.splice(index, 1);
      }
    }

    openDropdown(name: string) {
      this.dropdownOpened.push(name);
    }

    toogleDropdown(name: string) {
      const index = this.dropdownOpened.indexOf(name, 0);
      if (index > -1) {
        this.closeDropdown(name);
      } else {
        this.openDropdown(name);
      }
    }
}
