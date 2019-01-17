import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { Retirement } from '../../../../models/retirement';
import { RetirementService } from '../../../../services/retirement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-retirement',
  templateUrl: './retirement.component.html',
  styleUrls: ['./retirement.component.scss']
})
export class RetirementComponent implements OnInit {

  retirementId: number;
  retirement: Retirement;

  retirementForm: FormGroup;
  errors: string[];

  retirementFields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('shared.form.retirement.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('shared.form.retirement.name_in_english')
    },
    {
      name: 'place_name',
      type: 'text',
      label: _('shared.form.retirement.place_name')
    },
    {
      name: 'activity_language',
      type: 'select',
      label: _('shared.form.retirement.activity_language'),
      choices: [
        {
          label: _('shared.form.retirement.activity_language.choices.english'),
          value: 'EN'
        },
        {
          label: _('shared.form.retirement.activity_language.choices.french'),
          value: 'FR'
        },
        {
          label: _('shared.form.retirement.activity_language.choices.bilingual'),
          value: 'B'
        }
      ]
    },
    {
      name: 'details_fr',
      type: 'textarea',
      label: _('shared.form.retirement.description_in_french')
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: _('shared.form.retirement.description_in_english')
    },
    {
      name: 'seats',
      type: 'number',
      label: _('shared.form.retirement.seats')
    },
    {
      name: 'price',
      type: 'number',
      label: _('shared.form.retirement.price')
    },
    {
      name: 'start_time',
      type: 'datetime',
      label: _('shared.form.retirement.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('shared.form.retirement.end_time')
    },
    {
      name: 'form_url',
      type: 'textarea',
      label: _('shared.form.retirement.form_url')
    },
    {
      name: 'carpool_url',
      type: 'textarea',
      label: _('shared.form.retirement.carpool_url')
    },
    {
      name: 'review_url',
      type: 'textarea',
      label: _('shared.form.retirement.review_url')
    },
    {
      name: 'email_content',
      type: 'textarea',
      label: _('shared.form.retirement.email_content')
    },
    {
      name: 'min_day_refund',
      type: 'number',
      label: _('shared.form.retirement.min_day_refund')
    },
    {
      name: 'min_day_exchange',
      type: 'number',
      label: _('shared.form.retirement.min_day_exchange')
    },
    {
      name: 'refund_rate',
      type: 'number',
      label: _('shared.form.retirement.refund_rate')
    },
    {
      name: 'warning',
      type: 'alert',
      label: _('shared.form.retirement.refund_rate_warning')
    },
    {
      name: 'address_line1_fr',
      type: 'text',
      label: _('shared.form.retirement.address_line1_in_french')
    },
    {
      name: 'address_line2_fr',
      type: 'text',
      label: _('shared.form.retirement.address_line2_in_french')
    },
    {
      name: 'address_line1_en',
      type: 'text',
      label: _('shared.form.retirement.address_line1_in_english')
    },
    {
      name: 'address_line2_en',
      type: 'text',
      label: _('shared.form.retirement.address_line2_in_english')
    },
    {
      name: 'postal_code',
      type: 'text',
      label: _('shared.form.retirement.postal_code')
    },
    {
      name: 'city_fr',
      type: 'text',
      label: _('shared.form.retirement.city_in_french')
    },
    {
      name: 'city_en',
      type: 'text',
      label: _('shared.form.retirement.city_in_english')
    },
    {
      name: 'state_province_fr',
      type: 'text',
      label: _('shared.form.retirement.state_province_in_french')
    },
    {
      name: 'state_province_en',
      type: 'text',
      label: _('shared.form.retirement.state_province_in_english')
    },
    {
      name: 'country_fr',
      type: 'text',
      label: _('shared.form.retirement.country_in_french')
    },
    {
      name: 'country_en',
      type: 'text',
      label: _('shared.form.retirement.country_in_english')
    },
    {
      name: 'accessibility',
      type: 'checkbox',
      label: _('shared.form.retirement.accessibility')
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: _('shared.form.retirement.available')
    },
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private retirementService: RetirementService,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.retirementId = params['id'];
      this.refreshRetirement();
    });

    const formUtil = new FormUtil();
    this.retirementForm = formUtil.createFormGroup(this.retirementFields);
  }

  refreshRetirement() {
    this.retirementService.get(this.retirementId).subscribe(
      data => {
        this.retirement = new Retirement(data);
      }
    );
  }

  OpenModalEditRetirement() {
    this.retirementForm.reset();
    this.retirementForm.controls['name_fr'].setValue(this.retirement.name_fr);
    this.retirementForm.controls['name_en'].setValue(this.retirement.name_en);
    this.retirementForm.controls['details_fr'].setValue(this.retirement.details_fr);
    this.retirementForm.controls['details_en'].setValue(this.retirement.details_en);
    this.retirementForm.controls['activity_language'].setValue(this.retirement.activity_language);
    this.retirementForm.controls['seats'].setValue(this.retirement.seats);
    this.retirementForm.controls['price'].setValue(this.retirement.price);
    this.retirementForm.controls['start_time'].setValue(this.retirement.start_time);
    this.retirementForm.controls['end_time'].setValue(this.retirement.end_time);
    this.retirementForm.controls['min_day_refund'].setValue(this.retirement.min_day_refund);
    this.retirementForm.controls['min_day_exchange'].setValue(this.retirement.min_day_exchange);
    this.retirementForm.controls['refund_rate'].setValue(this.retirement.refund_rate);
    this.retirementForm.controls['address_line1_fr'].setValue(this.retirement.address_line1_fr);
    this.retirementForm.controls['address_line2_fr'].setValue(this.retirement.address_line2_fr);
    this.retirementForm.controls['address_line1_en'].setValue(this.retirement.address_line1_en);
    this.retirementForm.controls['address_line2_en'].setValue(this.retirement.address_line2_en);
    this.retirementForm.controls['postal_code'].setValue(this.retirement.postal_code);
    this.retirementForm.controls['city_fr'].setValue(this.retirement.city_fr);
    this.retirementForm.controls['city_en'].setValue(this.retirement.city_en);
    this.retirementForm.controls['state_province_fr'].setValue(this.retirement.state_province_fr);
    this.retirementForm.controls['state_province_en'].setValue(this.retirement.state_province_en);
    this.retirementForm.controls['country_fr'].setValue(this.retirement.country_fr);
    this.retirementForm.controls['country_en'].setValue(this.retirement.country_en);
    this.retirementForm.controls['is_active'].setValue(this.retirement.is_active);
    this.retirementForm.controls['form_url'].setValue(this.retirement.form_url);
    this.retirementForm.controls['carpool_url'].setValue(this.retirement.carpool_url);
    this.retirementForm.controls['review_url'].setValue(this.retirement.review_url);
    this.retirementForm.controls['email_content'].setValue(this.retirement.email_content);
    this.retirementForm.controls['accessibility'].setValue(this.retirement.accessibility);
    this.retirementForm.controls['place_name'].setValue(this.retirement.place_name);


    this.toogleModal(
      'form_retirements',
      _('retirement.edit_retirement_modal.title'),
      _('retirement.edit_retirement_modal.button')
    );
  }

  toogleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  submitRetirement() {
    const value = this.retirementForm.value;
    value['timezone'] = 'America/Montreal';
    if (value['address_line2'] === '') {
      value['address_line2'] = null;
    }
    if ( this.retirementForm.valid ) {
      this.retirementService.update(this.retirement.url, value).subscribe(
        data => {
          this.notificationService.success(
            _('shared.notifications.commons.added.title')
          );
          this.refreshRetirement();
          this.toogleModal('form_retirements');
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.errors =  ['shared.form.errors.unknown'];
          }
          this.retirementForm = FormUtil.manageFormErrors(this.retirementForm, err);
        }
      );
    }
  }
}
