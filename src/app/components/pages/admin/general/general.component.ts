import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {OrderService} from '../../../../services/order.service';
import {RetreatReservationService} from '../../../../services/retreat-reservation.service';
import {ReservationService} from '../../../../services/reservation.service';
import {AuthenticationService} from '../../../../services/authentication.service';

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
              private retreatReservationService: RetreatReservationService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.refreshUserCount();
    this.refreshRetreatReservationCount();
    this.refreshTimeslotReservationCount();
  }

  get isAdmin(){
    return this.authenticationService.isAdmin();
  }

  refreshUserCount() {
    this.userService.list(null, 1).subscribe(
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
