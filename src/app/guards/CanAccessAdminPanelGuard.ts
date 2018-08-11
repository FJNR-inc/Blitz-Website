import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class CanAccessAdminPanelGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {}

  canActivate() {
    if (this.authenticationService.hasPermissions(['access_admin_panel'])) {
      return true;
    } else {
      this.router.navigate(['/403']);
      return false;
    }
  }
}
