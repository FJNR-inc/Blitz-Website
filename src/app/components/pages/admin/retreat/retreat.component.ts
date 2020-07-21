import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Retreat, ROOM_CHOICES} from '../../../../models/retreat';
import { RetreatService } from '../../../../services/retreat.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { User } from '../../../../models/user';
import { RetreatReservation } from '../../../../models/retreatReservation';
import { UserService } from '../../../../services/user.service';
import { RetreatReservationService } from '../../../../services/retreat-reservation.service';
import { isNull } from 'util';
import { TableRetreatReservationsComponent } from '../../../table/table-retreat-reservations/table-retreat-reservations.component';

@Component({
  selector: 'app-retreat',
  templateUrl: './retreat.component.html',
  styleUrls: ['./retreat.component.scss']
})
export class RetreatComponent implements OnInit {

  retreatId: number;
  retreat: Retreat;

  @ViewChild(TableRetreatReservationsComponent, { static: false })
  private tableRetreat: TableRetreatReservationsComponent;

  retreatForm: FormGroup;
  cancelReservationForm: FormGroup;
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
    noDataText: _('retreat.users-page.no_users'),
    allowFiltering: false,
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'first_name',
        title: _('retreat.common.first_name')
      },
      {
        name: 'last_name',
        title: _('retreat.common.last_name')
      },
      {
        name: 'email',
        title: _('retreat.common.email')
      }
    ]
  };

  retreatFields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('retreat.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('retreat.form.name_in_english')
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
      name: 'place_name',
      type: 'text',
      label: _('retreat.form.place_name')
    },
    {
      name: 'activity_language',
      type: 'select',
      label: _('retreat.form.activity_language'),
      choices: [
        {
          label: _('retreat.form.activity_language.choices.english'),
          value: 'EN'
        },
        {
          label: _('retreat.form.activity_language.choices.french'),
          value: 'FR'
        },
        {
          label: _('retreat.form.activity_language.choices.bilingual'),
          value: 'B'
        }
      ]
    },
    {
      name: 'room_type',
      type: 'select',
      label: _('retreat.form.room_type'),
      choices: [
        {
          label: _('retreat.form.room_type.choices.single_occupation'),
          value: ROOM_CHOICES.SINGLE_OCCUPATION
        },
        {
          label: _('retreat.form.room_type.choices.double_occupation'),
          value: ROOM_CHOICES.DOUBLE_OCCUPATION
        },
        {
          label: _('retreat.form.room_type.choices.double_single_occupation'),
          value: ROOM_CHOICES.DOUBLE_SINGLE_OCCUPATION
        }
      ]
    },
    {
      name: 'details_fr',
      type: 'textarea',
      label: _('retreat.form.description_in_french')
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: _('retreat.form.description_in_english')
    },
    {
      name: 'seats',
      type: 'number',
      label: _('retreat.form.seats')
    },
    {
      name: 'price',
      type: 'number',
      label: _('retreat.form.price')
    },
    {
      name: 'start_time',
      type: 'datetime',
      label: _('retreat.form.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('retreat.form.end_time')
    },
    {
      name: 'form_url',
      type: 'textarea',
      label: _('retreat.form.form_url')
    },
    {
      name: 'carpool_url',
      type: 'textarea',
      label: _('retreat.form.carpool_url')
    },
    {
      name: 'review_url',
      type: 'textarea',
      label: _('retreat.form.review_url')
    },
    {
      name: 'email_content',
      type: 'textarea',
      label: _('retreat.form.email_content')
    },
    {
      name: 'min_day_refund',
      type: 'number',
      label: _('retreat.form.min_day_refund')
    },
    {
      name: 'min_day_exchange',
      type: 'number',
      label: _('retreat.form.min_day_exchange')
    },
    {
      name: 'refund_rate',
      type: 'number',
      label: _('retreat.form.refund_rate')
    },
    {
      name: 'warning',
      type: 'alert',
      label: _('retreat.form.refund_rate_warning')
    },
    {
      name: 'address_line1_fr',
      type: 'text',
      label: _('retreat.form.address_line1_in_french')
    },
    {
      name: 'address_line2_fr',
      type: 'text',
      label: _('retreat.form.address_line2_in_french')
    },
    {
      name: 'address_line1_en',
      type: 'text',
      label: _('retreat.form.address_line1_in_english')
    },
    {
      name: 'address_line2_en',
      type: 'text',
      label: _('retreat.form.address_line2_in_english')
    },
    {
      name: 'postal_code',
      type: 'text',
      label: _('retreat.form.postal_code')
    },
    {
      name: 'city_fr',
      type: 'text',
      label: _('retreat.form.city_in_french')
    },
    {
      name: 'city_en',
      type: 'text',
      label: _('retreat.form.city_in_english')
    },
    {
      name: 'state_province_fr',
      type: 'text',
      label: _('retreat.form.state_province_in_french')
    },
    {
      name: 'state_province_en',
      type: 'text',
      label: _('retreat.form.state_province_in_english')
    },
    {
      name: 'country_fr',
      type: 'text',
      label: _('retreat.form.country_in_french')
    },
    {
      name: 'country_en',
      type: 'text',
      label: _('retreat.form.country_in_english')
    },
    {
      name: 'accessibility',
      type: 'checkbox',
      label: _('retreat.form.accessibility')
    },
    {
      name: 'toilet_gendered',
      type: 'checkbox',
      label: _('retreat.form.toilet_gendered')
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: _('retreat.form.available')
    },
    {
      name: 'has_shared_rooms',
      type: 'checkbox',
      label: _('retreat.form.has_shared_rooms')
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: _('retreat.form.hidden')
    },
  ];

  selectedReservationOnCancellation = null;
  securityOnCancelReservation = false;
  refundOnCancelReservation = false;
  cancelReservationFields = [
    {
      name: 'warning',
      type: 'alert',
      label: _('retreat.cancel_reservation_modal.warning')
    },
    {
      name: 'refund',
      type: 'checkbox',
      label: _('retreat.cancel_reservation_modal.refund')
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
      if (this.retreatId) {
        this.refreshRetreat();
      }
    });

    const formUtil = new FormUtil();
    this.retreatForm = formUtil.createFormGroup(this.retreatFields);
    this.cancelReservationForm = formUtil.createFormGroup(this.cancelReservationFields);
  }

  refreshRetreat() {
    this.retreatService.get(this.retreatId).subscribe(
      data => {
        this.retreat = new Retreat(data);
      }
    );
  }

  OpenModalEditRetreat() {
    this.router.navigate(['/admin/retreats/edit/' + this.retreat.id]);
  }

  toogleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  submitRetreat() {

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
    retreatReservation.retreat = this.retreat.url;

    this.retreatReservationService.create(retreatReservation).subscribe(
      () => {
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

  exportOptions() {
    this.retreatService.exportOptions(this.retreat.id).subscribe(
      data => {
        window.open(data.file_url);
      }
    );
  }

  removeUserFromRetreat(event) {
    if (!event.is_active) {
      this.selectedReservationOnCancellation = event;
      this.securityOnCancelReservation = false;
      this.toogleModal(
        'cancel_reservation',
        _('retreat.cancel_reservation_modal.title'),
        _('retreat.cancel_reservation_modal.button')
      );
    } else {
      console.log(event);
      this.notificationService.error(
        _('retreat.notifications.cancellation_already_done.title')
      );
    }
  }

  cancelReservation() {
    this.retreatReservationService.remove(
      this.selectedReservationOnCancellation,
      {
        force_refund: this.refundOnCancelReservation
      }
    ).subscribe(
      data => {
        this.toogleModal('cancel_reservation');
        this.notificationService.success(
          _('retreat.notifications.cancellation_success.title')
        );
        this.tableRetreat.refreshPeriodList();
      },
      err => {
        this.errors = err.error.non_field_errors;
      }
    );
  }
}
