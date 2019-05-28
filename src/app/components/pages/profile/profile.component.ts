import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/user';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: User;

  totalPastTimeslotTomatoes = 0;
  totalFutureTimeslotTomatoes = 0;
  totalPastRetreatTomatoes = 0;
  totalFutureRetreatTomatoes = 0;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.profile = this.authenticationService.getProfile();

    this.authenticationService.profile.subscribe(
      emitedProfile => this.profile = new User(emitedProfile)
    );
  }

  getTotalPastTomatoes() {
    return this.totalPastTimeslotTomatoes + this.totalPastRetreatTomatoes;
  }

  getTotalFutureTomatoes() {
    return this.totalFutureTimeslotTomatoes + this.totalFutureRetreatTomatoes;
  }
}
