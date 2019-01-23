import { Component, OnInit } from '@angular/core';
import {User} from '../../../../models/user';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {ProfileService} from '../../../../services/profile.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  profile: User;
  userForm: FormGroup;
  errors: string[];

  fields = [
    {
      name: 'first_name',
      type: 'text',
      label: _('shared.form.first_name')
    },
    {
      name: 'last_name',
      type: 'text',
      label: _('shared.form.last_name')
    },
    {
      name: 'birthdate',
      type: 'date',
      label: _('shared.form.birthdate')
    },
    {
      name: 'gender',
      type: 'select',
      label: _('shared.form.gender'),
      choices: [
        {
          label: _('shared.form.gender_male'),
          value: 'M'
        },
        {
          label: _('shared.form.gender_female'),
          value: 'F'
        },
        {
          label: _('shared.form.gender_no_binary'),
          value: 'T'
        },
        {
          label: _('shared.form.gender_none'),
          value: 'A'
        }
      ]
    },
  ];

  constructor(private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private notificationService: MyNotificationService) { }

  ngOnInit() {
    this.refreshProfile();
  }

  resetForm() {
    const formUtil = new FormUtil();
    this.userForm = formUtil.createFormGroup(this.fields);
    this.userForm.controls['first_name'].setValue(this.profile.first_name);
    this.userForm.controls['last_name'].setValue(this.profile.last_name);
    this.userForm.controls['birthdate'].setValue(this.profile.getBirthdate());
    this.userForm.controls['gender'].setValue(this.profile.gender);

  }

  refreshProfile() {
    this.profileService.get().subscribe(
      profile => {
        this.authenticationService.setProfile(profile);
        this.profile = new User(this.authenticationService.getProfile());
        this.authenticationService.profile.subscribe(
          emitedProfile => this.profile = new User(emitedProfile)
        );
        this.resetForm();
      }
    );
  }

  submitProfile() {
    if ( this.userForm.valid ) {
      const value = this.userForm.value;
      if (this.userForm.controls['birthdate']) {
        const birthdate = this.userForm.controls['birthdate'].value.toISOString().substr(0, 10);
        value['birthdate'] = birthdate;
      }
      this.userService.update(this.profile.url, value).subscribe(
        data => {
          this.notificationService.success(_('shared.notifications.commons.added.title'));
          this.refreshProfile();
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          }
          if (err.error.first_name) {
            this.userForm.controls['first_name'].setErrors({
              apiError: err.error.first_name
            });
          }
          if (err.error.last_name) {
            this.userForm.controls['last_name'].setErrors({
              apiError: err.error.last_name
            });
          }
          if (err.error.birthdate) {
            this.userForm.controls['birthdate'].setErrors({
              apiError: err.error.birthdate
            });
          }
          if (err.error.gender) {
            this.userForm.controls['gender'].setErrors({
              apiError: err.error.gender
            });
          }
        }
      );
    }
  }
}
