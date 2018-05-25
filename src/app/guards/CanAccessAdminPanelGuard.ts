import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class CanAccessAdminPanelGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService) {}

  canActivate() {
    return this.authenticationService.hasPermissions(['access_admin_panel']);
  }
}
