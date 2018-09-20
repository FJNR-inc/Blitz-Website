import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {AuthenticationService} from '../../services/authentication.service';
import {ProfileService} from '../../services/profile.service';

@Component({
  selector: 'app-nt-top',
  templateUrl: './nt-top.component.html',
  styleUrls: ['./nt-top.component.scss']
})
export class NtTopComponent implements OnInit {

  user: User = null;

  constructor(private authenticationService: AuthenticationService,
              private profileService: ProfileService) { }

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.profileService.get().subscribe(
        profile => {
          this.authenticationService.setProfile(profile);
          this.user = new User(this.authenticationService.getProfile());
          this.authenticationService.profile.subscribe(
            emitedProfile => this.user = new User(emitedProfile)
          );
        }
      );
    }
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }
}
