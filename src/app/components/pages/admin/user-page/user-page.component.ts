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
import {NotificationsService} from 'angular2-notifications';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  user: User;

  settings = {
    noDataText: 'Aucune réservation pour le moment',
    clickable: true,
    title: 'Réservations',
    columns: [
      {
        name: 'start_event',
        title: 'Plage horaire'
      },
      {
        name: 'workplace_name',
        title: 'Lieu'
      },
      {
        name: 'is_active',
        title: 'Active',
        type: 'boolean'
      },
      {
        name: 'is_present',
        title: 'Present',
        type: 'boolean'
      },
      {
        name: 'cancelation_reason_long',
        title: 'Raison'
      }
    ]
  };

  settingsCard = {
    noDataText: 'Aucune carte de paiement pour le moment',
    title: 'Cartes de paiements',
    columns: [
      {
        name: 'number',
        title: 'Numéro de carte'
      },
      {
        name: 'expiry_date',
        title: 'Date d\'expiration'
      }
    ]
  };

  settingsCustomPayment = {
    noDataText: 'Aucun paiement personalisé pour le moment',
    title: 'Custom payments',
    addButton: true,
    columns: [
      {
        name: 'name',
        title: 'Name'
      },
      {
        name: 'price',
        title: 'Price'
      },
      {
        name: 'details',
        title: 'details'
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
      label: 'Price'
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name'
    },
    {
      name: 'details',
      type: 'textarea',
      label: 'Details'
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
      this.userService.get(params['id']).subscribe(
        data => {
          this.user = new User(data);
          this.refreshReservation();
          this.refreshListCard();
          this.refreshListCustomPayment();
        }
      );
    });
    this.initFormCustomPayment();
  }

  initFormCustomPayment() {
    const formUtil = new FormUtil();
    this.customPaymentForm = formUtil.createFormGroup(this.customPaymentFields);
  }

  refreshReservation() {
    this.reservationService.list([{'name': 'user', 'value': this.user.id}]).subscribe(
      timeslots => {
        this.listReservations = timeslots.results.map(
          t => this.reservationAdapter(new TimeSlot(t))
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

    const reservationAdapted = {
      id: timeslot.id,
      start_event: detail,
      workplace_name: workplace.name,
      is_active: reservation.is_active,
      is_present: reservation.is_present,
      cancelation_reason: reservation.cancelation_reason
    };

    if (reservation.cancelation_reason === 'TM') {
      reservationAdapted['cancelation_reason_long'] = 'Plage horaire modifié';
    } else if (reservation.cancelation_reason === 'U') {
      reservationAdapted['cancelation_reason_long'] = 'Annulé par l\'utilisateur';
    } else if (reservation.cancelation_reason === 'TD') {
      reservationAdapted['cancelation_reason_long'] = 'Plage horaire supprimé';
    } else {
      reservationAdapted['cancelation_reason_long'] = '-';
    }

    return reservationAdapted;
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

  createCustomPayment() {
    const value = this.customPaymentForm.value;
    value['user'] = this.user.url;
    value['single_use_token'] = this.singleUseToken;

    this.customPaymentService.create(value).subscribe(
      data => {
        this.notificationService.success('shared.notifications.commons.added.title');
        this.refreshListCustomPayment();
        this.myModalService.get('add_custom_payment').toggle();
      },
      err => {
        if (err.error.non_field_errors) {
          this.customPaymentErrors = err.error.non_field_errors;
        } else {
          this.translate.get('shared.form.errors.unknown').subscribe(
            (translatedLabel: string) => {
              this.customPaymentErrors =  [translatedLabel];
            }
          );
        }
        this.customPaymentForm = FormUtil.manageFormErrors(this.customPaymentForm, err);
      }
    );
  }

  setSingleUseToken(singleUseToken) {
    this.singleUseToken = singleUseToken;
  }
}
