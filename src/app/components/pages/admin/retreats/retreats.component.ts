import { Component, OnInit } from '@angular/core';
import { Retreat } from '../../../../models/retreat';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RetreatService } from '../../../../services/retreat.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Router } from '@angular/router';
import { isNull } from 'util';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-retreats',
  templateUrl: './retreats.component.html',
  styleUrls: ['./retreats.component.scss']
})
export class RetreatsComponent implements OnInit {

  listRetreats: Retreat[];

  retreatForm: FormGroup;
  retreatErrors: string[];
  selectedRetreatUrl: string;
  retreatInDeletion: any = null;

  settings = {
    title: _('retreats.retreats'),
    noDataText: _('retreats.no_retreat'),
    addButton: true,
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('shared.form.name')
      }
    ]
  };

  securityOnDeletion = '';

  fields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('shared.form.retreat.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('shared.form.retreat.name_in_english')
    },
    {
      name: 'place_name',
      type: 'text',
      label: _('shared.form.retreat.place_name')
    },
    {
      name: 'activity_language',
      type: 'select',
      label: _('shared.form.retreat.activity_language'),
      choices: [
        {
          label: _('shared.form.retreat.activity_language.choices.english'),
          value: 'EN'
        },
        {
          label: _('shared.form.retreat.activity_language.choices.french'),
          value: 'FR'
        },
        {
          label: _('shared.form.retreat.activity_language.choices.bilingual'),
          value: 'B'
        }
      ]
    },
    {
      name: 'details_fr',
      type: 'textarea',
      label: _('shared.form.retreat.description_in_french')
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: _('shared.form.retreat.description_in_english')
    },
    {
      name: 'seats',
      type: 'number',
      label: _('shared.form.retreat.seats')
    },
    {
      name: 'price',
      type: 'number',
      label: _('shared.form.retreat.price')
    },
    {
      name: 'start_time',
      type: 'datetime',
      label: _('shared.form.retreat.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('shared.form.retreat.end_time')
    },
    {
      name: 'form_url',
      type: 'textarea',
      label: _('shared.form.retreat.form_url')
    },
    {
      name: 'carpool_url',
      type: 'textarea',
      label: _('shared.form.retreat.carpool_url')
    },
    {
      name: 'review_url',
      type: 'textarea',
      label: _('shared.form.retreat.review_url')
    },
    {
      name: 'email_content',
      type: 'textarea',
      label: _('shared.form.retreat.email_content')
    },
    {
      name: 'min_day_refund',
      type: 'number',
      label: _('shared.form.retreat.min_day_refund')
    },
    {
      name: 'min_day_exchange',
      type: 'number',
      label: _('shared.form.retreat.min_day_exchange')
    },
    {
      name: 'refund_rate',
      type: 'number',
      label: _('shared.form.retreat.refund_rate')
    },
    {
      name: 'warning',
      type: 'alert',
      label: _('shared.form.retreat.refund_rate_warning')
    },
    {
      name: 'address_line1_fr',
      type: 'text',
      label: _('shared.form.retreat.address_line1_in_french')
    },
    {
      name: 'address_line2_fr',
      type: 'text',
      label: _('shared.form.retreat.address_line2_in_french')
    },
    {
      name: 'address_line1_en',
      type: 'text',
      label: _('shared.form.retreat.address_line1_in_english')
    },
    {
      name: 'address_line2_en',
      type: 'text',
      label: _('shared.form.retreat.address_line2_in_english')
    },
    {
      name: 'postal_code',
      type: 'text',
      label: _('shared.form.retreat.postal_code')
    },
    {
      name: 'city_fr',
      type: 'text',
      label: _('shared.form.retreat.city_in_french')
    },
    {
      name: 'city_en',
      type: 'text',
      label: _('shared.form.retreat.city_in_english')
    },
    {
      name: 'state_province_fr',
      type: 'text',
      label: _('shared.form.retreat.state_province_in_french')
    },
    {
      name: 'state_province_en',
      type: 'text',
      label: _('shared.form.retreat.state_province_in_english')
    },
    {
      name: 'country_fr',
      type: 'text',
      label: _('shared.form.retreat.country_in_french')
    },
    {
      name: 'country_en',
      type: 'text',
      label: _('shared.form.retreat.country_in_english')
    },
    {
      name: 'accessibility',
      type: 'checkbox',
      label: _('shared.form.retreat.accessibility')
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: _('shared.form.retreat.available')
    },
    {
      name: 'has_shared_rooms',
      type: 'checkbox',
      label: _('shared.form.retreat.has_shared_rooms')
    }
  ];

  constructor(private retreatService: RetreatService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.refreshRetreatList();
    this.initRetreatForm();
  }

  initRetreatForm() {
    const formUtil = new FormUtil();
    this.retreatForm = formUtil.createFormGroup(this.fields);
  }

  changePage(index: number) {
    this.refreshRetreatList(index);
  }

  refreshRetreatList(page = 1, limit = 20) {
    this.retreatService.list(null, limit, limit * (page - 1)).subscribe(
      retreats => {
        this.settings.numberOfPage = Math.ceil(retreats.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(retreats.previous);
        this.settings.next = !isNull(retreats.next);
        this.listRetreats = retreats.results.map(o => new Retreat(o));
      }
    );
  }

  OpenModalCreateRetreat() {
    this.initRetreatForm();
    this.selectedRetreatUrl = null;
    this.toggleModal(
      'form_retreats',
      _('retreats.create_retreat_modal.title'),
      _('retreats.create_retreat_modal.button')
    );
  }

  redirectToRetreat(id = null) {
    let url = '/admin/retreats/';
    if (id !== null) {
      url += id.toString();
    } else {
      url += 'new';
    }
    this.router.navigate([url]);
  }

  removeRetreat(item = null, force = false) {
    if (!item && !this.retreatInDeletion) {
      console.error('No one timeslot given in argument');
    } else {
      if (item) {
        this.retreatInDeletion = item;
      }
      if (!force) {
        this.securityOnDeletion = '';
        this.toggleModal(
          'validation_deletion',
          _('retreats.force_delete_retreat_modal.title'),
          _('retreats.force_delete_retreat_modal.button')
        );
      } else {
        this.retreatService.remove(this.retreatInDeletion).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.delete_space.title'),
              _('shared.notifications.delete_space.content')
            );
            this.refreshRetreatList();
          },
          err => {
            this.notificationService.error(
              _('shared.notifications.fail_deletion.title'),
              _('shared.notifications.fail_deletion.content')
            );
          }
        );
      }
    }
  }

  toggleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  submitRetreat() {
    const value = this.retreatForm.value;
    value['timezone'] = 'America/Montreal';
    this.retreatService.create(value).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.commons.added.title')
        );
        this.refreshRetreatList();
        this.toggleModal('form_retreats');
      },
      err => {
        if (err.error.non_field_errors) {
          this.retreatErrors = err.error.non_field_errors;
        } else {
          this.retreatErrors =  ['shared.form.errors.unknown'];
        }
        this.retreatForm = FormUtil.manageFormErrors(this.retreatForm, err);
      }
    );
  }

  isSecurityOnDeletionValid() {
    if (this.retreatInDeletion) {
      return this.retreatInDeletion.name === this.securityOnDeletion;
    } else {
      return false;
    }
  }
}
