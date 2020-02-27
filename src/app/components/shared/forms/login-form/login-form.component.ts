import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormUtil} from '../../../../utils/form';
import {FormGroup} from '@angular/forms';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ProfileService} from '../../../../services/profile.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  loginErrors;
  loginFields = [
    {
      name: 'username',
      type: 'text',
      label: _('login-form.labels.email')
    },
    {
      name: 'password',
      type: 'password',
      label: _('login-form.labels.password')
    }
  ];

  @Input() registerLink = true;
  @Input() forgotPasswordLink = true;

  @Output() isConnected: EventEmitter<any> = new EventEmitter();

  constructor(private authenticationService: AuthenticationService,
              private profileService: ProfileService) { }

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
          this.loginErrors =  [_('login-form.form.errors.unknown')];
        }
        this.loginForm = FormUtil.manageFormErrors(this.loginForm, err);
      }
    );
  }
}
