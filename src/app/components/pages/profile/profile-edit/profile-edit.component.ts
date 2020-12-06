import { Component, OnInit } from '@angular/core';
import {IUserEdit, User} from '../../../../models/user';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {ProfileService} from '../../../../services/profile.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {Organization} from '../../../../models/organization';
import { map } from 'rxjs/operators';
import {OrganizationService} from '../../../../services/organization.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  _profile: User;
  set profile(newProfile: User){
    this._profile = newProfile;
    this.refreshOrganizations();
  }
  get profile(): User { return this._profile; }

  userForm: FormGroup;
  errors: string[];
  organizations: Organization[] = [];

  fields = [
    {
      name: 'first_name',
      type: 'text',
      label: _('profile-edit.form.first_name')
    },
    {
      name: 'last_name',
      type: 'text',
      label: _('profile-edit.form.last_name')
    },
    {
      name: 'birthdate',
      type: 'date',
      label: _('profile-edit.form.birthdate')
    },
    {
      name: 'language',
      type: 'select',
      choices: [
        {
          label: _('profile-edit.form.language_en'),
          value: 'en'
        },
        {
          label: _('profile-edit.form.language_fr'),
          value: 'fr'
        },
      ],
      label: _('profile-edit.form.language')
    },
    {
      name: 'email',
      type: 'email',
      label: _('profile-edit.form.email')
    },
    {
      name: 'university',
      type: 'select',
      label: _('profile-edit.form.university'),
      choices: []
    },
    {
      name: 'gender',
      type: 'select',
      label: _('profile-edit.form.gender'),
      choices: [
        {
          label: _('profile-edit.form.gender_male'),
          value: 'M'
        },
        {
          label: _('profile-edit.form.gender_female'),
          value: 'F'
        },
        {
          label: _('profile-edit.form.gender_no_binary'),
          value: 'T'
        },
        {
          label: _('profile-edit.form.gender_none'),
          value: 'A'
        }
      ]
    },
    {
      name: 'phone',
      type: 'text',
      label: _('profile-edit.form.phone'),
      choices: []
    },
  ];

  constructor(private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private notificationService: MyNotificationService,
              private organizationService: OrganizationService
  ) { }

  ngOnInit() {
    this.refreshProfile();
  }

  updateFields() {
    for (const field of this.fields) {
      if (field.name === 'university') {
        field['choices'] = [
          {
            label: '---',
            value: '',
          }
        ];
        for (const organization of this.organizations) {
          field['choices'].push({
            label: organization.name,
            value: organization.name
          });
        }
      }
    }
  }

  resetForm() {
    const formUtil = new FormUtil();
    this.userForm = formUtil.createFormGroup(this.fields);
    this.userForm.controls['first_name'].setValue(this.profile.first_name);
    this.userForm.controls['last_name'].setValue(this.profile.last_name);
    this.userForm.controls['email'].setValue(this.profile.email);
    this.userForm.controls['university'].setValue((this.profile.university) ? this.profile.university.name : '');
    this.userForm.controls['language'].setValue(this.profile.language);
    this.userForm.controls['birthdate'].setValue(this.profile.getBirthdate());
    this.userForm.controls['gender'].setValue(this.profile.gender);
    this.userForm.controls['phone'].setValue(this.profile.phone);
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

  refreshOrganizations() {
    this.organizationService.list()
      .pipe(map(values => values.results))
      .subscribe(
        value => {
          this.organizations = value.map(l => new Organization(l));
          this.updateFields();
        }
      );
  }

  submitProfile() {
    if ( this.userForm.valid ) {
      const value: IUserEdit = this.userForm.value;
      if (this.userForm.controls.university.value !== '') {
        const newUniversity = this.userForm.controls.university.value;
        value.university = {'name': newUniversity};
      } else {
        value.university = null;
      }
      if (this.userForm.controls.birthdate) {
        value.birthdate = this.userForm.controls.birthdate.value.toISOString().substr(0, 10);
      }
      this.userService.update(this.profile.url, value).subscribe(
        () => {
          this.notificationService.success(_('profile-edit.notifications.commons.added.title'));
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
          if (err.error.email) {
            this.userForm.controls['email'].setErrors({
              apiError: err.error.email
            });
          }
          if (err.error.birthdate) {
            this.userForm.controls['birthdate'].setErrors({
              apiError: err.error.birthdate
            });
          }
          if (err.error.language) {
            this.userForm.controls['language'].setErrors({
              apiError: err.error.language
            });
          }
          if (err.error.gender) {
            this.userForm.controls['gender'].setErrors({
              apiError: err.error.gender
            });
          }
          if (err.error.university) {
            this.userForm.controls['university'].setErrors({
              apiError: err.error.university.name
            });
          }
          if (err.error.phone) {
            this.userForm.controls['phone'].setErrors({
              apiError: err.error.phone
            });
          }
        }
      );
    }
  }

  displayChangeEmailInfoText() {
    if (this.profile && this.userForm) {
      return this.profile.email !== this.userForm.controls['email'].value;
    }
  }
}
