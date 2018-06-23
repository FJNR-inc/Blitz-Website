import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { TimeSlot } from '../../../../models/timeSlot';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  user: User;

  settings = {
    columns: [
      {
        name: 'start_event',
        title: 'Plage horaire'
      }
    ]
  };

  listReservations: any[];

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private timeSlotService: TimeSlotService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userService.get(params['id']).subscribe(
        data => {
          this.user = new User(data);
          this.refreshReservation();
        }
      );
    });
  }

  refreshReservation() {
    this.timeSlotService.list([{'name': 'user', 'value': this.user.id}]).subscribe(
      timeslots => {
        this.listReservations = timeslots.results.map(
          t => this.listReservationsAdapter(new TimeSlot(t))
        );
      }
    );
  }

  listReservationsAdapter(reservation) {
    let detail = '';
    detail += reservation.getStartDay();
    detail += ' (';
    detail += reservation.getStartTime();
    detail += ' - ';
    detail += reservation.getEndTime() + ')';

    return {
      id: reservation.id,
      start_event: detail,
    };
  }
}
