import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Retreat} from '../../../../models/retreat';
import {RetreatReservation} from '../../../../models/retreatReservation';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {RetreatService} from '../../../../services/retreat.service';
import {RetreatReservationService} from '../../../../services/retreat-reservation.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-profile-retreats',
  templateUrl: './profile-retreats.component.html',
  styleUrls: ['./profile-retreats.component.scss']
})
export class ProfileRetreatsComponent implements OnInit {

  listRetreats: Retreat[];
  selectedRetreatReservation: RetreatReservation;
  errorCancelationRetreatReservation = null;
  errorExchangeRetreatReservation = null;
  selectedRetreatForExchange: string;

  listRetreatReservations: RetreatReservation[];
  listFutureRetreatReservations: RetreatReservation[];
  totalPastRetreatReservations = 0;
  totalFutureRetreatReservations = 0;

  displayAllRetreatReservation = false;
  retreatReservationOpen: number;

  @Output() totalPastTomatoes: EventEmitter<any> = new EventEmitter();
  @Output() totalFutureTomatoes: EventEmitter<any> = new EventEmitter();

  constructor(private retreatService: RetreatService,
              private retreatReservationService: RetreatReservationService,
              private authenticationService: AuthenticationService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService) { }

  ngOnInit() {
    this.refreshRetreats();
    this.refreshRetreatReservation();
  }

  refreshRetreats() {
    const now = new Date().toISOString();
    const filters = [
      {
        'name': 'is_active',
        'value': true
      },
      {
        'name': 'end_time__gte',
        'value': now
      }
    ];
    this.retreatService.list(filters).subscribe(
      reservations => {
        this.listRetreats = reservations.results.map(
          r => new Retreat(r)
        );
      }
    );
  }

  refreshRetreatReservation() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      },
      {
        'name': 'is_active',
        'value': true
      }
    ];
    this.retreatReservationService.list(filters).subscribe(
      retreatReservations => {
        const listRetreatReservations = retreatReservations.results.map(
          r => new RetreatReservation(r)
        );

        this.totalPastRetreatReservations = 0;
        this.totalFutureRetreatReservations = 0;
        this.listRetreatReservations = [];
        this.listFutureRetreatReservations = [];

        for ( const retreatReservation of listRetreatReservations ) {
          if (retreatReservation.retreat_details.getEndDate() < new Date()) {
            this.totalPastRetreatReservations += environment.tomato_per_retreat;
          } else {
            this.totalFutureRetreatReservations += environment.tomato_per_retreat;
            this.listFutureRetreatReservations.push(retreatReservation);
          }
          this.listRetreatReservations.push(retreatReservation);
        }

        this.totalPastTomatoes.emit(this.totalPastRetreatReservations);
        this.totalFutureTomatoes.emit(this.totalFutureRetreatReservations);
      }
    );
  }

  getDisplayedRetreatReservation() {
    if (this.displayAllRetreatReservation) {
      return this.listRetreatReservations;
    } else if (this.listFutureRetreatReservations) {
      return this.listFutureRetreatReservations;
    } else {
      return null;
    }
  }

  setDisplayAllRetreatReservation(value) {
    this.displayAllRetreatReservation = value;
  }

  openRetreatReservation(id: number) {
    if (this.retreatReservationOpen === id) {
      this.retreatReservationOpen = null;
    } else {
      this.retreatReservationOpen = id;
    }
  }

  openModalExchangeRetreatReservation(selectedRetreatReservation) {
    this.selectedRetreatReservation = selectedRetreatReservation;
    this.selectedRetreatForExchange = this.getChoicesExchangeRetreat()[0].url;
    this.refreshRetreats();
    this.toogleModal('form_exchange_retreat');
  }

  openModalCancelRetreatReservation(selectedRetreatReservation) {
    this.errorCancelationRetreatReservation = null;
    this.selectedRetreatReservation = selectedRetreatReservation;
    this.toogleModal('form_cancel_reservation_retreat');
  }

  getChoicesExchangeRetreat() {
    if (this.listRetreats) {
      const list = [];
      for (const retreat of this.listRetreats) {
        if (retreat.id !== this.selectedRetreatReservation.retreat_details.id) {
          if (retreat.places_remaining > 0) {
            list.push(retreat);
          }
        }
      }
      return list;
    } else {
      return [];
    }
  }

  exchangeRetreat() {
    const reservation = new RetreatReservation();
    reservation.retreat = this.selectedRetreatForExchange;
    this.retreatReservationService.update(this.selectedRetreatReservation.url, reservation).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.exchange_retreat_reservation.title'),
          _('shared.notifications.exchange_retreat_reservation.content')
        );
        this.refreshRetreatReservation();
        this.toogleModal('form_exchange_retreat');
      },
      err => {
        if (err.error.non_field_errors) {
          this.errorExchangeRetreatReservation = err.error.non_field_errors;
        } else {
          this.errorExchangeRetreatReservation = [_('shared.alert.errors.unknown')];
        }
      }
    );
  }

  cancelRetreat() {
    this.retreatReservationService.remove(this.selectedRetreatReservation).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.cancel_retreat_reservation.title'),
          _('shared.notifications.cancel_retreat_reservation.content')
        );
        this.refreshRetreatReservation();
        this.toogleModal('form_cancel_reservation_retreat');
      },
      err => {
        if (err.error.non_field_errors) {
          this.errorCancelationRetreatReservation = err.error.non_field_errors;
        } else {
          this.errorCancelationRetreatReservation = [_('shared.alert.errors.unknown')];
        }
      }
    );
  }

  toogleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }
    modal.toggle();
  }
}
