import { Component, OnInit } from '@angular/core';
import {User} from '../../../../models/user';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector: 'app-profile-subscription',
  templateUrl: './profile-subscription.component.html',
  styleUrls: ['./profile-subscription.component.scss']
})
export class ProfileSubscriptionComponent implements OnInit {

  profile: User;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.profile = this.authenticationService.getProfile();

    this.authenticationService.profile.subscribe(
      emitedProfile => this.profile = new User(emitedProfile)
    );
  }

}
