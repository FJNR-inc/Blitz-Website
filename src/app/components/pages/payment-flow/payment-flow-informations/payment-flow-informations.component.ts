import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {FormUtil} from '../../../../utils/form';
import {AuthenticationService} from '../../../../services/authentication.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-payment-flow-informations',
  templateUrl: './payment-flow-informations.component.html',
  styleUrls: ['./payment-flow-informations.component.scss']
})
export class PaymentFlowInformationsComponent implements OnInit {

  personalInformationForm: FormGroup;
  personalInformationErrors: string[];
  personalInformationFields = [
    {
      name: 'city',
      type: 'select',
      label: _('retreat-cart.labels.city'),
      choices: [
        {
          label: 'Chicoutimi',
          value: 'Chicoutimi'
        },
        {
          label: 'Gatineau',
          value: 'Gatineau'
        },
        {
          label: 'Laval',
          value: 'Laval'
        },
        {
          label: 'Longueuil',
          value: 'Longueuil'
        },
        {
          label: 'Montréal',
          value: 'Montreal'
        },
        {
          label: 'Ottawa',
          value: 'Ottawa'
        },
        {
          label: 'Québec',
          value: 'Québec'
        },
        {
          label: 'Rimouski',
          value: 'Rimouski'
        },
        {
          label: 'Rouyn Noranda',
          value: 'Rouyn Noranda'
        },
        {
          label: 'Sherbrooke',
          value: 'Sherbrooke'
        },
        {
          label: 'St-Jérôme',
          value: 'St-Jérôme'
        },
        {
          label: 'Trois-Rivière',
          value: 'Trois-Rivière'
        },
        {
          label: 'Autre',
          value: 'Autre'
        }
      ]
    },
    {
      name: 'phone',
      type: 'text',
      label: _('retreat-cart.labels.phone')
    },
    {
      name: 'personnal_restrictions',
      type: 'textarea',
      label: _('retreat-cart.labels.restrictions')
    }
  ];

  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
    this.initPersonalInformationForm();
  }

  initPersonalInformationForm() {
    const formUtil = new FormUtil();
    this.personalInformationForm = formUtil.createFormGroup(this.personalInformationFields);
    const profile = this.authenticationService.getProfile();
    this.personalInformationForm.controls['city'].setValue(profile.city);
    this.personalInformationForm.controls['phone'].setValue(profile.phone);
    this.personalInformationForm.controls['personnal_restrictions'].setValue(profile.personnal_restrictions);
  }

  personalInformationFormIsValid() {
    const profile = this.authenticationService.getProfile();
    return !!(profile.phone && profile.personnal_restrictions && profile.city);
  }

  submitPersonalInformation() {
    const value = this.personalInformationForm.value;
    const profile = this.authenticationService.getProfile();
    this.userService.update(profile.url, value).subscribe(
      user => {
        this.authenticationService.setProfile(user);
        this.forward.emit();
      },
      err => {
        if (err.error.non_field_errors) {
          this.personalInformationErrors = err.error.non_field_errors;
        } else {
          this.personalInformationErrors =  ['shared.form.errors.unknown'];
        }
        this.personalInformationForm = FormUtil.manageFormErrors(this.personalInformationForm, err);
      }
    );
  }

  goBack() {
    this.back.emit();
  }

  goForward() {
    this.submitPersonalInformation();
  }
}
