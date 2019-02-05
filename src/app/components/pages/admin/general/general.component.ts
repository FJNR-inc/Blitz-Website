import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {OrderService} from '../../../../services/order.service';
import {RetirementReservationService} from '../../../../services/retirement-reservation.service';
import {ReservationService} from '../../../../services/reservation.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  userCount = '-';
  timeslotReservationCount = '-';
  retreatReservationCount = '-';

  constructor(private userService: UserService,
              private reservationService: ReservationService,
              private retreatReservationService: RetirementReservationService) {
  }

  ngOnInit() {
    this.refreshUserCount();
    this.refreshRetreatReservationCount();
    this.refreshTimeslotReservationCount();
  }

  refreshUserCount() {
    this.userService.list(null,1).subscribe(
      data => {
        this.userCount = data.count;
      }
    );
  }

  refreshRetreatReservationCount() {
    this.retreatReservationService.list(null, 1).subscribe(
      data => {
        this.retreatReservationCount = data.count;
      }
    );
  }

  refreshTimeslotReservationCount() {
    this.reservationService.list(null, 1).subscribe(
      data => {
        this.timeslotReservationCount = data.count;
      }
    );
  }
}
