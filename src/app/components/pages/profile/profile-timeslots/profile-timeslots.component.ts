import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Workplace} from '../../../../models/workplace';
import {Reservation} from '../../../../models/reservation';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ReservationService} from '../../../../services/reservation.service';
import {WorkplaceService} from '../../../../services/workplace.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';

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
      },
      {
        'name': 'ordering',
        'value': '-timeslot__start_time'
      }
    ];
    this.reservationService.list(filters, 50).subscribe(
      reservations => {
        const listReservations = reservations.results.map(
          r => new Reservation(r)
        );

        this.listReservations = [];
        this.listFutureReservations = [];

        for ( const reservation of listReservations ) {
          if (reservation.timeslot_details.getEndDate() >= new Date()) {
            this.listFutureReservations.push(reservation);
          }
          this.listReservations.push(reservation);
        }
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
          _('profile-timeslots.notifications.cancel_bloc.title'),
          _('profile-timeslots.notifications.cancel_bloc.content')
        );
        this.refreshReservation();
      },
      err => {
        this.notificationService.error(
          _('profile-timeslots.notifications.fail_cancel_bloc.title'),
          _('profile-timeslots.notifications.fail_cancel_bloc.content')
        );
      }
    );
  }

  toogleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      return;
    }
    modal.toggle();
  }
}
