import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Retreat, ROOM_CHOICES} from '../../../../models/retreat';
import { RetreatService } from '../../../../services/retreat.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
import {RetreatType} from '../../../../models/retreatType';
import {RetreatTypeService} from '../../../../services/retreat-type.service';
import {RetreatDate} from '../../../../models/retreatDate';
import {AcademicLevel} from '../../../../models/academicLevel';
import {Membership} from '../../../../models/membership';
import {MembershipService} from '../../../../services/membership.service';


interface Choice {
  value: any;
  label: string;
}

@Component({
  selector: 'app-retreat',
  templateUrl: './retreat.component.html',
  styleUrls: ['./retreat.component.scss']
})
export class RetreatComponent implements OnInit {

  retreatId: number;
  retreat: Retreat;
  retreatTypes: RetreatType[];
  retreatDates: RetreatDate[];

  @ViewChild(TableRetreatReservationsComponent, { static: false })
  private tableRetreat: TableRetreatReservationsComponent;

  retreatForm: FormGroup;
  cancelReservationForm: FormGroup;
  errors: string[];
  errorsOnActivation: string[];

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
      name: 'type',
      type: 'select',
      label: _('retreat.form.type'),
      choices: []
    },
    {
      name: 'animator',
      type: 'text',
      label: _('retreat.form.animator')
    },
    {
      name: 'place_name',
      type: 'text',
      label: _('retreat.form.place_name')
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
      name: 'form_url',
      type: 'text',
      label: _('retreat.form.form_url')
    },
    {
      name: 'carpool_url',
      type: 'text',
      label: _('retreat.form.carpool_url')
    },
    {
      name: 'review_url',
      type: 'text',
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
      name: 'has_shared_rooms',
      type: 'checkbox',
      label: _('retreat.form.has_shared_rooms')
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: _('retreat.form.hidden')
    },
    {
      name: 'exclusive_memberships',
      type: 'choices',
      label: _('retreat.form.memberships_required'),
      choices: []
    },
  ];

  virtualRetreatFields = [
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
      name: 'type',
      type: 'select',
      label: _('retreat.form.type'),
      choices: []
    },
    {
      name: 'animator',
      type: 'text',
      label: _('retreat.form.animator')
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
      name: 'form_url',
      type: 'text',
      label: _('retreat.form.form_url')
    },
    {
      name: 'review_url',
      type: 'text',
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
      name: 'hidden',
      type: 'checkbox',
      label: _('retreat.form.hidden')
    },
    {
      name: 'exclusive_memberships',
      type: 'choices',
      label: _('retreat.form.memberships_required'),
      choices: []
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
  listMemberships: Membership[];

  constructor(private activatedRoute: ActivatedRoute,
              private retreatService: RetreatService,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private userService: UserService,
              private retreatReservationService: RetreatReservationService,
              private router: Router,
              private retreatTypeService: RetreatTypeService,
              private membershipService: MembershipService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.retreatId = params['id'];
      this.refreshRetreat();
      this.refreshRetreatTypeList();
      this.refreshMembershipList();
    });
  }

  refreshRetreat() {
    this.retreatService.get(this.retreatId).subscribe(
      data => {
        this.retreat = new Retreat(data);
        this.initCancelReservationForm();
      }
    );
  }

  updateFields(membershipsSelected = []) {
    for (const list of [this.retreatFields, this.virtualRetreatFields]) {
      for (const field of list) {
        if (field.name === 'exclusive_memberships') {
          field['choices'] = [];
          for (const level of this.listMemberships) {
            const choice = {
              label: level.name,
              value: membershipsSelected.indexOf(level.url) > -1
            };
            // @ts-ignore
            field['choices'].push(choice);
          }
        }
      }
    }
  }

  activateRetreat() {
    this.retreatService.activate(this.retreat.url).subscribe(
      () => {
        this.notificationService.success(
          _('retreat.notifications.commons.activated.title')
        );
        this.refreshRetreat();
      },
      (err) => {
        this.errorsOnActivation = err.error['non_field_errors'];
        this.toggleModal('error_on_activation', 'Erreur d\'activation', 'J\'ai compris!');
      }
    );
  }

  refreshRetreatTypeList() {
    this.retreatTypeService.list().subscribe(
      (retreatTypes) => {
        this.retreatTypes = retreatTypes.results.map(
          o => new RetreatType(o)
        );
        const physicalTypeChoices = this.retreatFields.find(field => field.name === 'type');
        physicalTypeChoices.choices = [];
        const virtualTypeChoices = this.virtualRetreatFields.find(field => field.name === 'type');
        virtualTypeChoices.choices = [];
        for (const type of this.retreatTypes) {
          const choice: Choice = {
            value: type.url,
            label: type.name
          };
          physicalTypeChoices.choices.push(choice);
          virtualTypeChoices.choices.push(choice);
        }
      }
    );
  }

  initCancelReservationForm() {
    const formUtil = new FormUtil();
    this.cancelReservationForm = formUtil.createFormGroup(this.cancelReservationFields);

  }

  get formField() {
    if (this.retreat.type.is_virtual) {
      return this.virtualRetreatFields;
    } else {
      return this.retreatFields;
    }
  }

  refreshMembershipList() {
    this.membershipService.list().subscribe(
      levels => {
        this.listMemberships = levels.results.map(l => new AcademicLevel(l));
      }
    );
  }

  initRetreatForm() {
    /*
    Init form and init all values
     */

    const formUtil = new FormUtil();
    this.updateFields(this.retreat.exclusive_memberships);
    this.retreatForm = formUtil.createFormGroup(this.formField);

    if (this.retreat.type.is_virtual) {
      this.retreatForm.controls['videoconference_tool'].setValue(this.retreat.videoconference_tool);
      this.retreatForm.controls['videoconference_link'].setValue(this.retreat.videoconference_link);
    }
    if (!this.retreat.type.is_virtual) {
      this.retreatForm.controls['place_name'].setValue(this.retreat.place_name);
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

      this.retreatForm.controls['carpool_url'].setValue(this.retreat.carpool_url);
      this.retreatForm.controls['accessibility'].setValue(this.retreat.accessibility);
      this.retreatForm.controls['has_shared_rooms'].setValue(this.retreat.has_shared_rooms);
      this.retreatForm.controls['room_type'].setValue(this.retreat.room_type);
      this.retreatForm.controls['toilet_gendered'].setValue(this.retreat.toilet_gendered);
    }

    this.retreatForm.controls['type'].setValue(this.retreat.type.url);
    this.retreatForm.controls['name_fr'].setValue(this.retreat.name_fr);
    this.retreatForm.controls['name_en'].setValue(this.retreat.name_en);
    this.retreatForm.controls['details_fr'].setValue(this.retreat.details_fr);
    this.retreatForm.controls['details_en'].setValue(this.retreat.details_en);
    this.retreatForm.controls['activity_language'].setValue(this.retreat.activity_language);
    this.retreatForm.controls['seats'].setValue(this.retreat.seats);
    this.retreatForm.controls['price'].setValue(this.retreat.price);
    this.retreatForm.controls['min_day_refund'].setValue(this.retreat.min_day_refund);
    this.retreatForm.controls['min_day_exchange'].setValue(this.retreat.min_day_exchange);
    this.retreatForm.controls['refund_rate'].setValue(this.retreat.refund_rate);
    this.retreatForm.controls['form_url'].setValue(this.retreat.form_url);
    this.retreatForm.controls['review_url'].setValue(this.retreat.review_url);
    this.retreatForm.controls['email_content'].setValue(this.retreat.email_content);
    this.retreatForm.controls['hidden'].setValue(this.retreat.hidden);
    this.retreatForm.controls['animator'].setValue(this.retreat.animator);
  }

  OpenModalEditRetreat() {
    this.initRetreatForm();
    this.toggleModal(
      'form_retreats',
      _('retreats.create_retreat_modal.title'),
      _('retreats.create_retreat_modal.button')
    );
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

    const formArray = this.retreatForm.get('exclusive_memberships') as FormArray;
    value['exclusive_memberships'] = [];
    let index = 0;
    for (const control of formArray.controls) {
      if (control.value) {
        value['exclusive_memberships'].push(this.listMemberships[index].url);
      }
      index++;
    }

    if ( this.retreatForm.valid ) {
      this.retreatService.update(this.retreat.url, value).subscribe(
        () => {
          this.notificationService.success(
            _('retreat.notifications.commons.updated.title')
          );
          this.errors = [];
          this.toggleModal('form_retreats');
          this.refreshRetreat();
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.errors =  ['retreats.form.errors.unknown'];
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
    this.toggleModal(
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
        this.toggleModal('select_user');
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
      this.toggleModal(
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
        this.toggleModal('cancel_reservation');
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
