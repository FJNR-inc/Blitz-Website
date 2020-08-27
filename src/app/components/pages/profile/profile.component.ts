import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/user';
import {AuthenticationService} from '../../../services/authentication.service';
import {RetreatReservation} from '../../../models/retreatReservation';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: User;

  totalPastTimeslotTomatoes = 0;
  totalFutureTimeslotTomatoes = 0;
  totalPastPhysicalRetreatTomatoes = 0;
  totalFuturePhysicalRetreatTomatoes = 0;
  totalPastVirtualRetreatTomatoes = 0;
  totalFutureVirtualRetreatTomatoes = 0;
  openVirtualReservation: RetreatReservation;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.profile = this.authenticationService.getProfile();

    this.authenticationService.profile.subscribe(
      emitedProfile => this.profile = new User(emitedProfile)
    );
  }

  getTotalPastTomatoes() {
    return this.totalPastTimeslotTomatoes + this.totalPastPhysicalRetreatTomatoes + this.totalPastVirtualRetreatTomatoes;
  }

  getTotalFutureTomatoes() {
    return this.totalFutureTimeslotTomatoes + this.totalFuturePhysicalRetreatTomatoes + this.totalFutureVirtualRetreatTomatoes;
  }
}
