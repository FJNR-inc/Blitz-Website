import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  login: string;
  password: string;
  error: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationsService
  ) {}

  authenticate() {
    this.authenticationService.authenticate(this.login, this.password).subscribe(
      data => {
        console.log('YEAHHHH!');
        localStorage.setItem('token', data.token);
        this.notificationService.success('Connecté', 'Bienvenue!');
        this.router.navigate(['/']);
      },
      err => {
        this.error = 'Ces identifiants sont incorrects!';
      }
    );
  }
}
