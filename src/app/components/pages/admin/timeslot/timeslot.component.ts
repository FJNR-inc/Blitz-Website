import { Component, OnInit } from '@angular/core';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Card} from '../../../../models/card';
import {ReservationService} from '../../../../services/reservation.service';
import {Reservation} from '../../../../models/reservation';
import {User} from '../../../../models/user';

@Component({
  selector: 'app-timeslot',
  templateUrl: './timeslot.component.html',
  styleUrls: ['./timeslot.component.scss']
})
export class TimeslotComponent implements OnInit {

  timeslot: TimeSlot;
  listReservations: Reservation[];

  settings = {
    clickable: true,
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
      }
    ]
  };

  constructor(private timeslotService: TimeSlotService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private reservationService: ReservationService) { }

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

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    };
  }
}
