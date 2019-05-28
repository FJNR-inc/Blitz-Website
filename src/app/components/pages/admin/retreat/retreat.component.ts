import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { Retreat } from '../../../../models/retreat';
import { RetreatService } from '../../../../services/retreat.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { User } from '../../../../models/user';
import { RetreatReservation } from '../../../../models/retreatReservation';
import { UserService } from '../../../../services/user.service';
import { RetreatReservationService } from '../../../../services/retreat-reservation.service';
import { isNull } from 'util';
import { Router } from '@angular/router';
import { TableRetreatReservationsComponent } from '../../../table/table-retreat-reservations/table-retreat-reservations.component';

@Component({
  selector: 'app-retreat',
  templateUrl: './retreat.component.html',
  styleUrls: ['./retreat.component.scss']
})
export class RetreatComponent implements OnInit {

  retreatId: number;
  retreat: Retreat;

  @ViewChild(TableRetreatReservationsComponent)
  private tableRetreat: TableRetreatReservationsComponent;

  retreatForm: FormGroup;
  errors: string[];

  warningMessage = [_('retreat.add_user_modal.warning1'),
                    _('retreat.add_user_modal.warning2')];

  noUniversity = _('retreat.add_user_modal.no_university');


  listUsers: User[];
  selectedUser = null;
  userFilters = [];

  limitChoices = [10, 20, 100, 1000];
  limit = 10;
  page = 1;

  settings = {
    noDataText: _('users-page.no_users'),
    allowFiltering: false,
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'first_name',
        title: _('shared.common.first_name')
      },
      {
        name: 'last_name',
        title: _('shared.common.last_name')
      },
      {
        name: 'email',
        title: _('shared.common.email')
      }
    ]
  };

  filters = [
    {
      display: 'Prénom',
      name: 'first_name',
      comparators: [
        {
          display: 'contient',
          name: 'contain'
        },
        {
          display: 'est egal a',
          name: 'equal_to'
        }
      ]
    },
    {
      display: 'Université',
      name: 'university',
      comparators: [
        {
          display: 'est',
          name: 'is'
        },
        {
          display: 'n\'est pas',
          name: 'is_not'
        }
      ]
    },
  ];

  retreatFields = [
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
    },
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private retreatService: RetreatService,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private userService: UserService,
              private retreatReservationService: RetreatReservationService,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.retreatId = params['id'];
      this.refreshRetreat();
    });

    const formUtil = new FormUtil();
    this.retreatForm = formUtil.createFormGroup(this.retreatFields);
  }

  refreshRetreat() {
    this.retreatService.get(this.retreatId).subscribe(
      data => {
        this.retreat = new Retreat(data);
      }
    );
  }

  OpenModalEditRetreat() {
    this.retreatForm.reset();
    this.retreatForm.controls['name_fr'].setValue(this.retreat.name_fr);
    this.retreatForm.controls['name_en'].setValue(this.retreat.name_en);
    this.retreatForm.controls['details_fr'].setValue(this.retreat.details_fr);
    this.retreatForm.controls['details_en'].setValue(this.retreat.details_en);
    this.retreatForm.controls['activity_language'].setValue(this.retreat.activity_language);
    this.retreatForm.controls['seats'].setValue(this.retreat.seats);
    this.retreatForm.controls['price'].setValue(this.retreat.price);
    this.retreatForm.controls['start_time'].setValue(this.retreat.start_time);
    this.retreatForm.controls['end_time'].setValue(this.retreat.end_time);
    this.retreatForm.controls['min_day_refund'].setValue(this.retreat.min_day_refund);
    this.retreatForm.controls['min_day_exchange'].setValue(this.retreat.min_day_exchange);
    this.retreatForm.controls['refund_rate'].setValue(this.retreat.refund_rate);
    this.retreatForm.controls['address_line1_fr'].setValue(this.retreat.address_line1_fr);
    this.retreatForm.controls['address_line2_fr'].setValue(this.retreat.address_line2_fr);
    this.retreatForm.controls['address_line1_en'].setValue(this.retreat.address_line1_en);
    this.retreatForm.controls['address_line2_en'].setValue(this.retreat.address_line2_en);
    this.retreatForm.controls['postal_code'].setValue(this.retreat.postal_code);
    this.retreatForm.controls['city_fr'].setValue(this.retreat.city_fr);
    this.retreatForm.controls['city_en'].setValue(this.retreat.city_en);
    this.retreatForm.controls['state_province_fr'].setValue(this.retreat.state_province_fr);
    this.retreatForm.controls['state_province_en'].setValue(this.retreat.state_province_en);
    this.retreatForm.controls['country_fr'].setValue(this.retreat.country_fr);
    this.retreatForm.controls['country_en'].setValue(this.retreat.country_en);
    this.retreatForm.controls['is_active'].setValue(this.retreat.is_active);
    this.retreatForm.controls['form_url'].setValue(this.retreat.form_url);
    this.retreatForm.controls['carpool_url'].setValue(this.retreat.carpool_url);
    this.retreatForm.controls['review_url'].setValue(this.retreat.review_url);
    this.retreatForm.controls['email_content'].setValue(this.retreat.email_content);
    this.retreatForm.controls['accessibility'].setValue(this.retreat.accessibility);
    this.retreatForm.controls['place_name'].setValue(this.retreat.place_name);
    this.retreatForm.controls['has_shared_rooms'].setValue(this.retreat.has_shared_rooms);


    this.toogleModal(
      'form_retreats',
      _('retreat.edit_retreat_modal.title'),
      _('retreat.edit_retreat_modal.button')
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

  submitRetreat() {
    const value = this.retreatForm.value;
    value['timezone'] = 'America/Montreal';
    if (value['address_line2'] === '') {
      value['address_line2'] = null;
    }
    if ( this.retreatForm.valid ) {
      this.retreatService.update(this.retreat.url, value).subscribe(
        data => {
          this.notificationService.success(
            _('shared.notifications.commons.added.title')
          );
          this.refreshRetreat();
          this.toogleModal('form_retreats');
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.errors =  ['shared.form.errors.unknown'];
          }
          this.retreatForm = FormUtil.manageFormErrors(this.retreatForm, err);
        }
      );
    }
  }

  addUserToRetreat() {
    this.refreshUserList();
    this.selectedUser = null;
    this.errors = null;
    this.toogleModal(
      'select_user',
      _('retreat.add_user_modal.title'),
      _('retreat.add_user_modal.button')
    );
  }

  updateFilter(name, value) {
    let update = false;
    for (const filter of this.userFilters) {
      if (filter.name === name) {
        filter.value = value;
        update = true;
      }
    }
    if (!update) {
      const newFilter = {
        name: name,
        value: value
      };
      this.userFilters.push(newFilter);
    }
    this.refreshUserList();
  }

  updateFilters(filters) {
    this.userFilters = [];

    for (const filter of filters) {
        const newFilter = {
          'name': filter.name,
          'comparator': 'contain',
          'value': filter.value
        };
        this.userFilters.push(newFilter);
    }
    this.refreshUserList();
  }

  refreshUserList(page = this.page, limit = this.limit) {
    this.resetUserData();
    this.userService.list(this.userFilters, limit, limit * (page - 1)).subscribe(
      users => {
        this.settings.numberOfPage = Math.ceil(users.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(users.previous);
        this.settings.next = !isNull(users.next);
        this.listUsers = this.userAdapter(users.results.map(u => new User(u)));
        }
    );
  }

  resetUserData() {
    this.listUsers = null;
  }

  userAdapter(users) {
    const usersAdapted = [];
    for (let user of users) {
      user = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        university: user.getUniversity(),
        is_active: user.is_active,
        url: user.url
      };
      usersAdapted.push(user);
    }
    return usersAdapted;
  }

  selectUser(user) {
    this.selectedUser = user;
  }

  addUser() {
    const retreatReservation = new RetreatReservation();
    retreatReservation.user = this.selectedUser.url;
    retreatReservation.retirement = this.retreat.url;

    this.retreatReservationService.create(retreatReservation).subscribe(
      data => {
        this.tableRetreat.refreshPeriodList();
        this.toogleModal('select_user');
        this.selectedUser = null;
      },
      err => {
        console.log(err);
        this.errors = err.error.non_field_errors;
      }
    );
  }

  changePage(index: number) {
    this.page = index;
    this.refreshUserList();
  }

  changeLimit(event) {
    this.limit = event;
    this.page = 1;
    this.refreshUserList();
  }

  unselectUser() {
    this.selectedUser = null;
    this.errors = null;
  }

}
