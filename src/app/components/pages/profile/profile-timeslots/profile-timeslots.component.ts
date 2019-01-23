import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Workplace} from '../../../../models/workplace';
import {Reservation} from '../../../../models/reservation';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ReservationService} from '../../../../services/reservation.service';
import {WorkplaceService} from '../../../../services/workplace.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-profile-timeslots',
  templateUrl: './profile-timeslots.component.html',
  styleUrls: ['./profile-timeslots.component.scss']
})
export class ProfileTimeslotsComponent implements OnInit {

  listWorkplaces: Workplace[];

  listReservations: Reservation[] = [];
  listFutureReservations: Reservation[] = [];

  reservationInCancelation: Reservation = null;

  displayAll = false;

  totalPastReservations = 0;
  totalFutureReservations = 0;

  @Output() totalPastTomatoes: EventEmitter<any> = new EventEmitter();
  @Output() totalFutureTomatoes: EventEmitter<any> = new EventEmitter();

  constructor(private authenticationService: AuthenticationService,
              private reservationService: ReservationService,
              private workplaceService: WorkplaceService,
              private notificationService: MyNotificationService,
              private myModalService: MyModalService) { }

  ngOnInit() {
    this.refreshReservation();
    this.refreshListWorkplace();
  }

  refreshListWorkplace() {
    this.workplaceService.list().subscribe(
      workplaces => {
        if (workplaces.results.length >= 1) {
          this.listWorkplaces = workplaces.results.map(w => new Workplace(w));
        }
      }
    );
  }

  refreshReservation() {
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
    this.reservationService.list(filters).subscribe(
      reservations => {
        const listReservations = reservations.results.map(
          r => new Reservation(r)
        );

        this.totalPastReservations = 0;
        this.totalFutureReservations = 0;
        this.listReservations = [];
        this.listFutureReservations = [];

        for ( const reservation of listReservations ) {
          if (reservation.timeslot_details.getEndDate() < new Date()) {
            this.totalPastReservations += environment.tomato_per_timeslot;
          } else {
            this.totalFutureReservations += environment.tomato_per_timeslot;
            this.listFutureReservations.push(reservation);
          }
          this.listReservations.push(reservation);
        }

        this.totalPastTomatoes.emit(this.totalPastReservations);
        this.totalFutureTomatoes.emit(this.totalFutureReservations);
      }
    );
  }

  getDisplayedReservation() {
    if (this.displayAll) {
      return this.listReservations;
    } else {
      return this.listFutureReservations;
    }
  }

  setDisplayAll(value) {
    this.displayAll = value;
  }

  askToCancelReservation(reservation) {
    this.reservationInCancelation = reservation;
    this.toogleModal('form_cancel_reservation');
  }

  cancelReservation() {
    this.reservationService.remove(this.reservationInCancelation).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.cancel_bloc.title'),
          _('shared.notifications.cancel_bloc.content')
        );
        this.refreshReservation();
      },
      err => {
        this.notificationService.error(
          _('shared.notifications.fail_cancel_bloc.title'),
          _('shared.notifications.fail_cancel_bloc.content')
        );
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
