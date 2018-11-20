import { Component, OnInit } from '@angular/core';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Card} from '../../../../models/card';
import {ReservationService} from '../../../../services/reservation.service';
import {Reservation} from '../../../../models/reservation';
import {User} from '../../../../models/user';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {FormUtil} from '../../../../utils/form';

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
    clickable: true,
    editButton: true,
    noDataText: 'Aucune réservation pour le moment',
    title: 'Liste des réservations:',
    columns: [
      {
        name: 'first_name',
        title: 'Prénom'
      },
      {
        name: 'last_name',
        title: 'Nom'
      },
      {
        name: 'email',
        title: 'Courriel',
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
        name: 'cancelation_reason',
        title: 'Raison'
      }
    ]
  };

  constructor(private timeslotService: TimeSlotService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private reservationService: ReservationService,
              private myModalService: MyModalService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.timeslotService.get(params['id']).subscribe(
        timeslot => {
          this.timeslot = new TimeSlot(timeslot);
          this.refreshReservation();
        }
      );
    });
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

    const reservationAdapted = {
      id: user.id,
      url: reservation.url,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_active: reservation.is_active,
      is_present: reservation.is_present,
    };

    if (reservation.cancelation_reason === 'TM') {
      reservationAdapted['cancelation_reason'] = 'Plage horaire modifié';
    } else if (reservation.cancelation_reason === 'U') {
      reservationAdapted['cancelation_reason'] = 'Annulé par l\'utilisateur';
    } else {
      reservationAdapted['cancelation_reason'] = '-';
    }
    return reservationAdapted;
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
