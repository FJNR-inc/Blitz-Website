import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormUtil} from '../../../../utils/form';
import {FormGroup} from '@angular/forms';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ProfileService} from '../../../../services/profile.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  loginErrors: string[];
  loginFields = [
    {
      name: 'username',
      type: 'text',
      label: 'Adresse courriel'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Mot de passe'
    }
  ];

  @Input() registerLink = false;
  @Input() centered = false;

  @Output() isConnected: EventEmitter<any> = new EventEmitter();

  constructor(private authenticationService: AuthenticationService,
              private profileService: ProfileService,
              private notificationService: MyNotificationService,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit() {
    const formUtil = new FormUtil();
    this.loginForm = formUtil.createFormGroup(this.loginFields);
  }

  submitForm() {
    const value = this.loginForm.value;
    this.authenticationService.authenticate(value['username'], value['password']).subscribe(
      data => {
        this.authenticationService.setToken(data.token);
        this.profileService.get().subscribe(
          profile => {
            this.authenticationService.setProfile(profile);
            this.isConnected.emit(profile);
          }
        );
      },
      err => {
        if (err.error.non_field_errors) {
          this.loginErrors = err.error.non_field_errors;
        } else {
          this.translate.get('shared.form.errors.unknown').subscribe(
            (translatedLabel: string) => {
              this.loginErrors =  [translatedLabel];
            }
          );
        }
        this.loginForm = FormUtil.manageFormErrors(this.loginForm, err);
      }
    );
  }
}
