import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AuthenticationService } from '../../../services/authentication.service';


@Component({
  selector: 'app-logout',
  templateUrl: 'logout-page.component.html',
  styleUrls: []
})
export class LogoutPageComponent {

  constructor(private router: Router,
              private notificationService: NotificationsService,
              private authenticationService: AuthenticationService) {
    this.authenticationService.logout().subscribe(
      data => {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        this.notificationService.success('Déconnecté', 'À bientôt!');
        this.router.navigate(['/login']);
      }
    );
  }
}
