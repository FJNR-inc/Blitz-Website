import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {Retreat, ROOM_CHOICES, TYPE_CHOICES} from '../../../../models/retreat';
import {FormUtil} from '../../../../utils/form';
import {RetreatService} from '../../../../services/retreat.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-retreat-edit-form',
  templateUrl: './retreat-edit-form.component.html',
  styleUrls: ['./retreat-edit-form.component.scss']
})
export class RetreatEditFormComponent implements OnInit {

  retreatForm: FormGroup;
  retreatErrors: string[];
  type: TYPE_CHOICES;
  selectedRetreat: Retreat;

  fieldsVirtual = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('retreats.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('retreats.form.name_in_english')
    },
    {
      name: 'activity_language',
      type: 'select',
      label: _('retreats.form.activity_language'),
      choices: [
        {
          label: _('retreats.form.activity_language.choices.english'),
          value: 'EN'
        },
        {
          label: _('retreats.form.activity_language.choices.french'),
          value: 'FR'
        },
        {
          label: _('retreats.form.activity_language.choices.bilingual'),
          value: 'B'
        }
      ]
    },
    {
      name: 'videoconference_tool',
      type: 'text',
      label: _('retreat.form.videoconference_tool')
    },
    {
      name: 'videoconference_link',
      type: 'text',
      label: _('retreat.form.videoconference_link')
    },
    {
      name: 'details_fr',
      type: 'textarea',
      label: _('retreats.form.description_in_french')
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: _('retreats.form.description_in_english')
    },
    {
      name: 'seats',
      type: 'number',
      label: _('retreats.form.seats')
    },
    {
      name: 'price',
      type: 'number',
      label: _('retreats.form.price')
    },
    {
      name: 'start_time',
      type: 'datetime',
      label: _('retreats.form.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('retreats.form.end_time')
    },
    {
      name: 'form_url',
      type: 'textarea',
      label: _('retreats.form.form_url')
    },
    {
      name: 'review_url',
      type: 'textarea',
      label: _('retreats.form.review_url')
    },
    {
      name: 'email_content',
      type: 'textarea',
      label: _('retreats.form.email_content')
    },
    {
      name: 'min_day_refund',
      type: 'number',
      label: _('retreats.form.min_day_refund')
    },
    {
      name: 'min_day_exchange',
      type: 'number',
      label: _('retreats.form.min_day_exchange')
    },
    {
      name: 'refund_rate',
      type: 'number',
      label: _('retreats.form.refund_rate')
    },
    {
      name: 'warning',
      type: 'alert',
      label: _('retreats.form.refund_rate_warning')
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: _('retreats.form.available')
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: _('retreats.form.hidden')
    },
  ];

  fieldsPhysical = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('retreats.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('retreats.form.name_in_english')
    },
    {
      name: 'place_name',
      type: 'text',
      label: _('retreats.form.place_name')
    },
    {
      name: 'activity_language',
      type: 'select',
      label: _('retreats.form.activity_language'),
      choices: [
        {
          label: _('retreats.form.activity_language.choices.english'),
          value: 'EN'
        },
        {
          label: _('retreats.form.activity_language.choices.french'),
          value: 'FR'
        },
        {
          label: _('retreats.form.activity_language.choices.bilingual'),
          value: 'B'
        }
      ]
    },
    {
      name: 'room_type',
      type: 'select',
      label: _('retreats.form.room_type'),
      choices: [
        {
          label: _('retreats.form.room_type.choices.single_occupation'),
          value: ROOM_CHOICES.SINGLE_OCCUPATION
        },
        {
          label: _('retreats.form.room_type.choices.double_occupation'),
          value: ROOM_CHOICES.DOUBLE_OCCUPATION
        },
        {
          label: _('retreats.form.room_type.choices.double_single_occupation'),
          value: ROOM_CHOICES.DOUBLE_SINGLE_OCCUPATION
        }
      ]
    },
    {
      name: 'details_fr',
      type: 'textarea',
      label: _('retreats.form.description_in_french')
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: _('retreats.form.description_in_english')
    },
    {
      name: 'seats',
      type: 'number',
      label: _('retreats.form.seats')
    },
    {
      name: 'price',
      type: 'number',
      label: _('retreats.form.price')
    },
    {
      name: 'start_time',
      type: 'datetime',
      label: _('retreats.form.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('retreats.form.end_time')
    },
    {
      name: 'form_url',
      type: 'textarea',
      label: _('retreats.form.form_url')
    },
    {
      name: 'carpool_url',
      type: 'textarea',
      label: _('retreats.form.carpool_url')
    },
    {
      name: 'review_url',
      type: 'textarea',
      label: _('retreats.form.review_url')
    },
    {
      name: 'email_content',
      type: 'textarea',
      label: _('retreats.form.email_content')
    },
    {
      name: 'min_day_refund',
      type: 'number',
      label: _('retreats.form.min_day_refund')
    },
    {
      name: 'min_day_exchange',
      type: 'number',
      label: _('retreats.form.min_day_exchange')
    },
    {
      name: 'refund_rate',
      type: 'number',
      label: _('retreats.form.refund_rate')
    },
    {
      name: 'warning',
      type: 'alert',
      label: _('retreats.form.refund_rate_warning')
    },
    {
      name: 'address_line1_fr',
      type: 'text',
      label: _('retreats.form.address_line1_in_french')
    },
    {
      name: 'address_line2_fr',
      type: 'text',
      label: _('retreats.form.address_line2_in_french')
    },
    {
      name: 'address_line1_en',
      type: 'text',
      label: _('retreats.form.address_line1_in_english')
    },
    {
      name: 'address_line2_en',
      type: 'text',
      label: _('retreats.form.address_line2_in_english')
    },
    {
      name: 'postal_code',
      type: 'text',
      label: _('retreats.form.postal_code')
    },
    {
      name: 'city_fr',
      type: 'text',
      label: _('retreats.form.city_in_french')
    },
    {
      name: 'city_en',
      type: 'text',
      label: _('retreats.form.city_in_english')
    },
    {
      name: 'state_province_fr',
      type: 'text',
      label: _('retreats.form.state_province_in_french')
    },
    {
      name: 'state_province_en',
      type: 'text',
      label: _('retreats.form.state_province_in_english')
    },
    {
      name: 'country_fr',
      type: 'text',
      label: _('retreats.form.country_in_french')
    },
    {
      name: 'country_en',
      type: 'text',
      label: _('retreats.form.country_in_english')
    },
    {
      name: 'accessibility',
      type: 'checkbox',
      label: _('retreats.form.accessibility')
    },
    {
      name: 'toilet_gendered',
      type: 'checkbox',
      label: _('retreats.form.toilet_gendered')
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: _('retreats.form.available')
    },
    {
      name: 'has_shared_rooms',
      type: 'checkbox',
      label: _('retreats.form.has_shared_rooms')
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: _('retreats.form.hidden')
    },
  ];

  constructor(private retreatService: RetreatService,
              private notificationService: NotificationsService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.retreatService.get(params['id']).subscribe(
          data => {
            this.selectedRetreat = new Retreat(data);
            this.type = this.selectedRetreat.type;
            this.initRetreatForm();
          }
        );
      }
    );
  }

  initRetreatForm() {
    const formUtil = new FormUtil();
    this.retreatForm = formUtil.createFormGroup(this.fields);
    if (this.selectedRetreat) {
      this.populateForm();
    }
  }

  changeType(event) {
    this.type = event.target.value;
    this.initRetreatForm();
  }

  get fields() {
    if (this.type === 'V') {
      return this.fieldsVirtual;
    } else {
      return this.fieldsPhysical;
    }
  }

  populateForm() {
    this.retreatForm.reset();
    if (this.type === 'V') {
      this.retreatForm.controls['name_fr'].setValue(this.selectedRetreat.name_fr);
      this.retreatForm.controls['name_en'].setValue(this.selectedRetreat.name_en);
      this.retreatForm.controls['details_fr'].setValue(this.selectedRetreat.details_fr);
      this.retreatForm.controls['details_en'].setValue(this.selectedRetreat.details_en);
      this.retreatForm.controls['activity_language'].setValue(this.selectedRetreat.activity_language);
      this.retreatForm.controls['seats'].setValue(this.selectedRetreat.seats);
      this.retreatForm.controls['price'].setValue(this.selectedRetreat.price);
      this.retreatForm.controls['start_time'].setValue(this.selectedRetreat.start_time);
      this.retreatForm.controls['end_time'].setValue(this.selectedRetreat.end_time);
      this.retreatForm.controls['min_day_refund'].setValue(this.selectedRetreat.min_day_refund);
      this.retreatForm.controls['min_day_exchange'].setValue(this.selectedRetreat.min_day_exchange);
      this.retreatForm.controls['refund_rate'].setValue(this.selectedRetreat.refund_rate);
      this.retreatForm.controls['is_active'].setValue(this.selectedRetreat.is_active);
      this.retreatForm.controls['form_url'].setValue(this.selectedRetreat.form_url);
      this.retreatForm.controls['review_url'].setValue(this.selectedRetreat.review_url);
      this.retreatForm.controls['email_content'].setValue(this.selectedRetreat.email_content);
      this.retreatForm.controls['hidden'].setValue(this.selectedRetreat.hidden);
      this.retreatForm.controls['videoconference_tool'].setValue(this.selectedRetreat.videoconference_tool);
      this.retreatForm.controls['videoconference_link'].setValue(this.selectedRetreat.videoconference_link);
    } else {
      this.retreatForm.controls['name_fr'].setValue(this.selectedRetreat.name_fr);
      this.retreatForm.controls['name_en'].setValue(this.selectedRetreat.name_en);
      this.retreatForm.controls['details_fr'].setValue(this.selectedRetreat.details_fr);
      this.retreatForm.controls['details_en'].setValue(this.selectedRetreat.details_en);
      this.retreatForm.controls['activity_language'].setValue(this.selectedRetreat.activity_language);
      this.retreatForm.controls['seats'].setValue(this.selectedRetreat.seats);
      this.retreatForm.controls['price'].setValue(this.selectedRetreat.price);
      this.retreatForm.controls['start_time'].setValue(this.selectedRetreat.start_time);
      this.retreatForm.controls['end_time'].setValue(this.selectedRetreat.end_time);
      this.retreatForm.controls['min_day_refund'].setValue(this.selectedRetreat.min_day_refund);
      this.retreatForm.controls['min_day_exchange'].setValue(this.selectedRetreat.min_day_exchange);
      this.retreatForm.controls['refund_rate'].setValue(this.selectedRetreat.refund_rate);
      this.retreatForm.controls['address_line1_fr'].setValue(this.selectedRetreat.address_line1_fr);
      this.retreatForm.controls['address_line2_fr'].setValue(this.selectedRetreat.address_line2_fr);
      this.retreatForm.controls['address_line1_en'].setValue(this.selectedRetreat.address_line1_en);
      this.retreatForm.controls['address_line2_en'].setValue(this.selectedRetreat.address_line2_en);
      this.retreatForm.controls['postal_code'].setValue(this.selectedRetreat.postal_code);
      this.retreatForm.controls['city_fr'].setValue(this.selectedRetreat.city_fr);
      this.retreatForm.controls['city_en'].setValue(this.selectedRetreat.city_en);
      this.retreatForm.controls['state_province_fr'].setValue(this.selectedRetreat.state_province_fr);
      this.retreatForm.controls['state_province_en'].setValue(this.selectedRetreat.state_province_en);
      this.retreatForm.controls['country_fr'].setValue(this.selectedRetreat.country_fr);
      this.retreatForm.controls['country_en'].setValue(this.selectedRetreat.country_en);
      this.retreatForm.controls['is_active'].setValue(this.selectedRetreat.is_active);
      this.retreatForm.controls['form_url'].setValue(this.selectedRetreat.form_url);
      this.retreatForm.controls['carpool_url'].setValue(this.selectedRetreat.carpool_url);
      this.retreatForm.controls['review_url'].setValue(this.selectedRetreat.review_url);
      this.retreatForm.controls['email_content'].setValue(this.selectedRetreat.email_content);
      this.retreatForm.controls['accessibility'].setValue(this.selectedRetreat.accessibility);
      this.retreatForm.controls['place_name'].setValue(this.selectedRetreat.place_name);
      this.retreatForm.controls['has_shared_rooms'].setValue(this.selectedRetreat.has_shared_rooms);
      this.retreatForm.controls['hidden'].setValue(this.selectedRetreat.hidden);
      this.retreatForm.controls['toilet_gendered'].setValue(this.selectedRetreat.toilet_gendered);
      this.retreatForm.controls['room_type'].setValue(this.selectedRetreat.room_type);
    }
  }

  submit() {
    if (this.selectedRetreat) {
      const value = this.retreatForm.value;
      value['type'] = this.type;
      value['timezone'] = 'America/Montreal';
      if (value['address_line2'] === '') {
        value['address_line2'] = null;
      }
      if ( this.retreatForm.valid ) {
        this.retreatService.update(this.selectedRetreat.url, value).subscribe(
          () => {
            this.notificationService.success(
              _('retreat.notifications.commons.added.title')
            );
            this.router.navigate(['/admin/retreats/' + this.selectedRetreat.id]);
          },
          err => {
            if (err.error.non_field_errors) {
              this.retreatErrors = err.error.non_field_errors;
            } else {
              this.retreatErrors =  ['retreats.form.errors.unknown'];
            }
            this.retreatForm = FormUtil.manageFormErrors(this.retreatForm, err);
          }
        );
      }
    } else {
      const value = this.retreatForm.value;
      value['type'] = this.type;
      value['timezone'] = 'America/Montreal';
      this.retreatService.create(value).subscribe(
        () => {
          this.notificationService.success(
            _('retreats.notifications.commons.added.title')
          );
          this.router.navigate(['/admin/retreats']);
        },
        err => {
          if (err.error.non_field_errors) {
            this.retreatErrors = err.error.non_field_errors;
          } else {
            this.retreatErrors =  ['retreats.form.errors.unknown'];
          }
          this.retreatForm = FormUtil.manageFormErrors(this.retreatForm, err);
        }
      );
    }
  }
}
