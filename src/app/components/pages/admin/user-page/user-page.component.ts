import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import { TimeSlot } from '../../../../models/timeSlot';
import { Card } from '../../../../models/card';
import { CardService } from '../../../../services/card.service';
import {ReservationService} from '../../../../services/reservation.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {Workplace} from '../../../../models/workplace';
import {CustomPaymentsService} from '../../../../services/custom-payments.service';
import {CustomPayment} from '../../../../models/customPayment';
import {FormUtil} from '../../../../utils/form';
import {FormGroup} from '@angular/forms';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {Reservation} from '../../../../models/reservation';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  user: User;
  id: number;

  timeslotDeletedModalTitle = _('user-page.modal_timeslot_deleted.title');
  timeslotDeletedModalButtonLabel = _('user-page.modal_timeslot_deleted.button');

  customPaymentModalTitle = _('user-page.modal_add_custom_payment.title');
  customPaymentModalButtonLabel = _('user-page.modal_add_custom_payment.button');

  editUserModalTitle = _('user-page.modal_edit_user.title');
  editUserModalButtonLabel = _('user-page.modal_edit_user.button');

  settings = {
    noDataText: _('user-page.no_reservation'),
    clickable: true,
    title: _('user-page.reservations'),
    columns: [
      {
        name: 'start_event',
        title: _('shared.common.bloc')
      },
      {
        name: 'workplace_name',
        title: _('shared.common.place')
      },
      {
        name: 'is_active',
        title: _('shared.common.active'),
        type: 'boolean'
      },
      {
        name: 'is_present',
        title: _('shared.common.present'),
        type: 'boolean'
      },
      {
        name: 'cancelation_reason_long',
        title: _('shared.common.reason')
      }
    ]
  };

  settingsCard = {
    noDataText: _('user-page.no_payment_card'),
    title: _('user-page.payment_card'),
    columns: [
      {
        name: 'number',
        title: _('shared.common.card_number')
      },
      {
        name: 'expiry_date',
        title: _('shared.common.expiration_date')
      }
    ]
  };

  settingsCustomPayment = {
    noDataText: _('user-page.no_custom_payment'),
    title:  _('user-page.custom_payment'),
    addButton: true,
    columns: [
      {
        name: 'name',
        title: _('shared.common.name')
      },
      {
        name: 'price',
        title: _('shared.common.price')
      },
      {
        name: 'details',
        title: _('shared.common.details')
      }
    ]
  };

  listReservations: any[];
  listCards: Card[];
  listCustomPayments: CustomPayment[];

  customPaymentForm: FormGroup;
  customPaymentErrors: string[];
  singleUseToken: string;
  customPaymentFields = [
    {
      name: 'price',
      type: 'number',
      label: _('shared.common.price')
    },
    {
      name: 'name',
      type: 'text',
      label: _('shared.common.name')
    },
    {
      name: 'details',
      type: 'textarea',
      label: _('shared.common.details')
    }
  ];

  userForm: FormGroup;
  userErrors: string[];
  userFields = [
    {
      name: 'first_name',
      type: 'text',
      label: _('shared.common.first_name')
    },
    {
      name: 'last_name',
      type: 'text',
      label: _('shared.common.last_name')
    },
    {
      name: 'birthdate',
      type: 'date',
      label: _('shared.common.birth_date')
    },
    {
      name: 'gender',
      type: 'select',
      label: _('shared.common.gender'),
      choices: [
        {
          label: _('shared.form.gender_none'),
          value: 'A'
        },
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
        }
      ]
    }
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private reservationService: ReservationService,
              private router: Router,
              private cardService: CardService,
              private myModalService: MyModalService,
              private customPaymentService: CustomPaymentsService,
              private notificationService: MyNotificationService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.refreshUser();
    });
    this.initFormCustomPayment();
    this.initFormUser();
  }

  initFormCustomPayment() {
    const formUtil = new FormUtil();
    this.customPaymentForm = formUtil.createFormGroup(this.customPaymentFields);
  }

  initFormUser() {
    const formUtil = new FormUtil();
    this.userForm = formUtil.createFormGroup(this.userFields);
  }

  refreshUser() {
    this.userService.get(this.id).subscribe(
      data => {
        this.user = new User(data);
        this.refreshReservation();
        this.refreshListCard();
        this.refreshListCustomPayment();
      }
    );
  }

  refreshReservation() {
    this.reservationService.list([{'name': 'user', 'value': this.user.id}]).subscribe(
      reservations => {
        this.listReservations = reservations.results.map(
          r => this.reservationAdapter(new Reservation(r))
        );
      }
    );
  }

  refreshListCard() {
    this.cardService.list([{'name': 'owner', 'value': this.user.id}]).subscribe(
      cards => {
        if (cards.results.length >= 1) {
          this.listCards = cards.results[0].cards.map(
            c => this.cardAdapter(new Card(c))
          );
        } else {
          this.listCards = [];
        }
      }
    );
  }

  refreshListCustomPayment() {
    this.customPaymentService.list([{'name': 'user', 'value': this.user.id}]).subscribe(
      customPayments => {
        if (customPayments.results.length >= 1) {
          this.listCustomPayments = customPayments.results.map(c => new CustomPayment(c));
        } else {
          this.listCustomPayments = [];
        }
      }
    );
  }

  reservationAdapter(reservation) {
    const timeslot = new TimeSlot(reservation.timeslot_details);
    const workplace = new Workplace(timeslot.workplace);
    let detail = '';
    detail += timeslot.getStartDay();
    detail += ' (';
    detail += timeslot.getStartTime();
    detail += ' - ';
    detail += timeslot.getEndTime() + ')';

    return {
      id: timeslot.id,
      start_event: detail,
      workplace_name: workplace.name,
      is_active: reservation.is_active,
      is_present: reservation.is_present,
      cancelation_reason: reservation.cancelation_reason,
      reservation_cancelation: reservation.getCancelationReasonLabel()
    };
  }

  cardAdapter(card: Card) {
    return {
      id: card.id,
      number: '**** **** **** ' + card.last_digits,
      expiry_date: card.card_expiry.month + '/' + card.card_expiry.year,
    };
  }

  goToTimeslot(event) {
    if (event.cancelation_reason !== 'TD') {
      this.router.navigate(['/admin/timeslot/' + event.id]);
    } else {
      this.toggleModal('timeslot_deleted');
    }
  }

  toggleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.toggle();
  }

  openModalCustomPayment() {
    this.singleUseToken = null;
    this.initFormCustomPayment();
    this.myModalService.get('add_custom_payment').toggle();
  }

  openModalUserEdition() {
    this.initFormUser();
    this.userForm.controls['first_name'].setValue(this.user.first_name);
    this.userForm.controls['last_name'].setValue(this.user.last_name);
    this.userForm.controls['birthdate'].setValue(this.user.getBirthdate());
    this.userForm.controls['gender'].setValue(this.user.gender);
    this.myModalService.get('edit_user').toggle();
  }

  createCustomPayment() {
    const value = this.customPaymentForm.value;
    value['user'] = this.user.url;
    value['single_use_token'] = this.singleUseToken;

    this.customPaymentService.create(value).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.commons.added.title')
        );
        this.refreshListCustomPayment();
        this.myModalService.get('add_custom_payment').toggle();
      },
      err => {
        if (err.error.non_field_errors) {
          this.customPaymentErrors = err.error.non_field_errors;
        } else {
          this.customPaymentErrors =  ['shared.form.errors.unknown'];
        }
        this.customPaymentForm = FormUtil.manageFormErrors(this.customPaymentForm, err);
      }
    );
  }

  editUser() {
    const value = this.userForm.value;
    value['birthdate'] = this.userForm.controls['birthdate'].value.toISOString().substr(0, 10);

    this.userService.update(this.user.url, value).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.commons.updated.title')
        );
        this.refreshUser();
        this.myModalService.get('edit_user').toggle();
      },
      err => {
        if (err.error.non_field_errors) {
          this.userErrors = err.error.non_field_errors;
        } else {
          this.userErrors =  ['shared.form.errors.unknown'];
        }
        this.userForm = FormUtil.manageFormErrors(this.userForm, err);
      }
    );
  }

  setSingleUseToken(singleUseToken) {
    this.singleUseToken = singleUseToken;
  }
}
