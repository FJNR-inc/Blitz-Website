import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  loginForm: FormGroup;
  errors: string[];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationsService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService
  ) {
    this.loginForm = this.formBuilder.group(
      {
        login: null,
        password: null
      }
    );
  }

  authenticate(form: FormGroup) {
    if ( form.valid ) {
      this.authenticationService.authenticate(form.value['login'], form.value['password']).subscribe(
        data => {
          localStorage.setItem('token', data.token);
          console.log('Connected');
          this.profileService.get().subscribe(
            profile => {
              console.log('Profiled');
              localStorage.setItem('userProfile', JSON.stringify(profile));
              this.notificationService.success('Connecté', 'Bienvenue!');
              this.router.navigate(['/']);            }
          );
        },
        err => {
          console.log(err.error);
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
            console.log(this.errors);
          }
          if (err.error.username) {
            this.loginForm.controls['login'].setErrors({
              apiError: err.error.username
            });
          }
          if (err.error.password) {
            this.loginForm.controls['password'].setErrors({
              apiError: err.error.password
            });
          }
        }
      );
    }
  }
}
