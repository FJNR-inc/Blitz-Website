import { Component, OnInit } from '@angular/core';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {ReservationService} from '../../../../services/reservation.service';
import {Reservation} from '../../../../models/reservation';
import {User} from '../../../../models/user';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector: 'app-timeslot',
  templateUrl: './timeslot.component.html',
  styleUrls: ['./timeslot.component.scss']
})
export class TimeslotComponent implements OnInit {

  timeslot: TimeSlot;
  listReservations: Reservation[];
  selectedReservation: any;
  errors: string[];

  settings = {
    editButton: true,
    noDataText: _('timeslot.no_reservation'),
    title: _('timeslot.list_reservations'),
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
        name: 'cancelation_reason',
        title: _('shared.common.reason')
      }
    ]
  };

  constructor(private timeslotService: TimeSlotService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private reservationService: ReservationService,
              private myModalService: MyModalService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.timeslotService.get(params['id']).subscribe(
        timeslot => {
          this.timeslot = new TimeSlot(timeslot);
          this.refreshReservation();
        }
      );
    });

    if (this.authenticationService.isAdmin()) {
      this.settings['clickable'] = true;
    }
  }

  goToUser(event) {
    this.router.navigate(['/admin/users/' + event.id]);
  }

  refreshReservation() {
    this.reservationService.list([{'name': 'timeslot', 'value': this.timeslot.id}]).subscribe(
      reservations => {
        this.listReservations = reservations.results.map(
          r => this.reservationAdapter(new Reservation(r))
        );
      }
    );
  }

  reservationAdapter(reservation) {
    const user = new User(reservation.user_details);

    return {
      id: user.id,
      url: reservation.url,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_active: reservation.is_active,
      is_present: reservation.is_present,
      cancelation_reason: reservation.getCancelationReasonLabel()
    };
  }

  editReservation(reservation) {
    this.selectedReservation = reservation;
    this.toggleModal('reservation_edition');
  }

  submitReservation(is_present) {
    const value = new Reservation({'is_present': is_present});
    this.reservationService.update(this.selectedReservation.url, value).subscribe(
      data => {
        this.toggleModal('reservation_edition');
        this.refreshReservation();
      },
      err => {
        if (err.error.non_field_errors) {
          this.errors = err.error.non_field_errors;
        } else if (err.error.is_present) {
          this.errors = err.error.is_present;
        }
      }
    );
  }

  toggleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.toggle();
  }
}
