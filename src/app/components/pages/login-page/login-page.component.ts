import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  loginForm: FormGroup;
  errors: string[];
  buttonDisabled = false;

  returnUrl: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private notificationService: MyNotificationService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute
  ) {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/profile';
    this.loginForm = this.formBuilder.group(
      {
        login: null,
        password: null
      }
    );
  }

  authenticate(form: FormGroup) {
    if ( form.valid ) {
      this.buttonDisabled = true;
      this.authenticationService.authenticate(form.value['login'], form.value['password']).subscribe(
        data => {
          this.buttonDisabled = false;
          this.authenticationService.setToken(data.token);
          this.profileService.get().subscribe(
            profile => {
              this.authenticationService.setProfile(profile);
              this.notificationService.success(
              _('shared.notifications.connected.title'),
                _('shared.notifications.connected.content')
              );
              this.router.navigate([this.returnUrl]);
            }
          );
        },
        err => {
          this.buttonDisabled = false;
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
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
