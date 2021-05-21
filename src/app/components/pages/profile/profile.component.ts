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
  openVirtualReservation: RetreatReservation;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.profile = this.authenticationService.getProfile();

    this.authenticationService.profile.subscribe(
      emitedProfile => this.profile = new User(emitedProfile)
    );
  }

  getTotalPastTomatoes() {
    return this.profile.get_number_of_past_tomatoes;
  }

  getTotalFutureTomatoes() {
    return this.profile.get_number_of_future_tomatoes;
  }
}
