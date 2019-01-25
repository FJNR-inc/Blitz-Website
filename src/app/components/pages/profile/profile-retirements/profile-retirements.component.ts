import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Retirement} from '../../../../models/retirement';
import {RetirementReservation} from '../../../../models/retirementReservation';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {RetirementService} from '../../../../services/retirement.service';
import {RetirementReservationService} from '../../../../services/retirement-reservation.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-profile-retirements',
  templateUrl: './profile-retirements.component.html',
  styleUrls: ['./profile-retirements.component.scss']
})
export class ProfileRetirementsComponent implements OnInit {

  listRetirements: Retirement[];
  selectedRetirementReservation: RetirementReservation;
  errorCancelationRetirementReservation = null;
  errorExchangeRetirementReservation = null;
  selectedRetirementForExchange: string;

  listRetirementReservations: RetirementReservation[];
  listFutureRetirementReservations: RetirementReservation[];
  totalPastRetirementReservations = 0;
  totalFutureRetirementReservations = 0;

  displayAllRetirementReservation = false;
  retirementReservationOpen: number;

  @Output() totalPastTomatoes: EventEmitter<any> = new EventEmitter();
  @Output() totalFutureTomatoes: EventEmitter<any> = new EventEmitter();

  constructor(private retirementService: RetirementService,
              private retirementReservationService: RetirementReservationService,
              private authenticationService: AuthenticationService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService) { }

  ngOnInit() {
    this.refreshRetirements();
    this.refreshRetirementReservation();
  }

  refreshRetirements() {
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
    this.retirementService.list(filters).subscribe(
      reservations => {
        this.listRetirements = reservations.results.map(
          r => new Retirement(r)
        );
      }
    );
  }

  refreshRetirementReservation() {
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
    this.retirementReservationService.list(filters).subscribe(
      retirementReservations => {
        const listRetirementReservations = retirementReservations.results.map(
          r => new RetirementReservation(r)
        );

        this.totalPastRetirementReservations = 0;
        this.totalFutureRetirementReservations = 0;
        this.listRetirementReservations = [];
        this.listFutureRetirementReservations = [];

        for ( const retirementReservation of listRetirementReservations ) {
          if (retirementReservation.retirement_details.getEndDate() < new Date()) {
            this.totalPastRetirementReservations += environment.tomato_per_retirement;
          } else {
            this.totalFutureRetirementReservations += environment.tomato_per_retirement;
            this.listFutureRetirementReservations.push(retirementReservation);
          }
          this.listRetirementReservations.push(retirementReservation);
        }

        this.totalPastTomatoes.emit(this.totalPastRetirementReservations);
        this.totalFutureTomatoes.emit(this.listFutureRetirementReservations);
      }
    );
  }

  getDisplayedRetirementReservation() {
    if (this.displayAllRetirementReservation) {
      return this.listRetirementReservations;
    } else if (this.listFutureRetirementReservations) {
      return this.listFutureRetirementReservations;
    } else {
      return null;
    }
  }

  setDisplayAllRetirementReservation(value) {
    this.displayAllRetirementReservation = value;
  }

  openRetirementReservation(id: number) {
    if (this.retirementReservationOpen === id) {
      this.retirementReservationOpen = null;
    } else {
      this.retirementReservationOpen = id;
    }
  }

  openModalExchangeRetirementReservation(selectedRetirementReservation) {
    this.selectedRetirementReservation = selectedRetirementReservation;
    this.refreshRetirements();
    this.toogleModal('form_exchange_retirement');
  }

  openModalCancelRetirementReservation(selectedRetirementReservation) {
    this.errorCancelationRetirementReservation = null;
    this.selectedRetirementReservation = selectedRetirementReservation;
    this.toogleModal('form_cancel_reservation_retirement');
  }

  getChoicesExchangeRetirement() {
    if (this.listRetirements) {
      const list = [];
      for (const retirement of this.listRetirements) {
        if (retirement.id !== this.selectedRetirementReservation.retirement_details.id) {
          if (retirement.places_remaining > 0) {
            list.push(retirement);
          }
        }
      }
      return list;
    } else {
      return [];
    }
  }

  exchangeRetirement() {
    const reservation = new RetirementReservation();
    reservation.retirement = this.selectedRetirementForExchange;
    this.retirementReservationService.update(this.selectedRetirementReservation.url, reservation).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.exchange_retirement_reservation.title'),
          _('shared.notifications.exchange_retirement_reservation.content')
        );
        this.refreshRetirementReservation();
        this.toogleModal('form_exchange_retirement');
      },
      err => {
        if (err.error.non_field_errors) {
          this.errorExchangeRetirementReservation = err.error.non_field_errors;
        } else {
          this.errorExchangeRetirementReservation = [_('shared.alert.errors.unknown')];
        }
      }
    );
  }

  cancelRetirement() {
    this.retirementReservationService.remove(this.selectedRetirementReservation).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.cancel_retirement_reservation.title'),
          _('shared.notifications.cancel_retirement_reservation.content')
        );
        this.refreshRetirementReservation();
        this.toogleModal('form_cancel_reservation_retirement');
      },
      err => {
        if (err.error.non_field_errors) {
          this.errorCancelationRetirementReservation = err.error.non_field_errors;
        } else {
          this.errorCancelationRetirementReservation = [_('shared.alert.errors.unknown')];
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
