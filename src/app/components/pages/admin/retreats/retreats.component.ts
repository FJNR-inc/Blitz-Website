import { Component, OnInit } from '@angular/core';
import {Retreat, ROOM_CHOICES} from '../../../../models/retreat';
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
    downloadButton: true,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('retreats.form.name')
      }
    ]
  };

  securityOnDeletion = '';

  fields = [
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
          () => {
            this.notificationService.success(
              _('retreats.notifications.delete_space.title'),
              _('retreats.notifications.delete_space.content')
            );
            this.refreshRetreatList();
          },
          () => {
            this.notificationService.error(
              _('retreats.notifications.fail_deletion.title'),
              _('retreats.notifications.fail_deletion.content')
            );
          }
        );
      }
    }
  }

  toggleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
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
      () => {
        this.notificationService.success(
          _('retreats.notifications.commons.added.title')
        );
        this.refreshRetreatList();
        this.toggleModal('form_retreats');
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

  isSecurityOnDeletionValid() {
    if (this.retreatInDeletion) {
      return this.retreatInDeletion.name === this.securityOnDeletion;
    } else {
      return false;
    }
  }

  exportReservations(retreat: Retreat) {
    this.retreatService.exportReservations(retreat.id).subscribe(
      data => {
        window.open(data.file_url);
      }
    );
  }
}
