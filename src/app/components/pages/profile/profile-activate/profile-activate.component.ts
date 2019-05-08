import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {map} from 'rxjs/operators';

import {UserService} from '../../../../services/user.service';
import {User} from '../../../../models/user';
import {ProfileService} from '../../../../services/profile.service';
import {AuthenticationService} from '../../../../services/authentication.service';


@Component({
  selector: 'app-profile-activate',
  templateUrl: './profile-activate.component.html',
  styleUrls: ['./profile-activate.component.scss']
})
export class ProfileActivateComponent implements OnInit {
  token: string;
  profile: User;
  flagSuccess = false;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.token = params['token'];
    });

    this.userService.activateToken(this.token)
      .pipe(map(result => result.user))
      .subscribe(
        value => {
          this.authenticationService.setProfile(value);
          this.profile = new User(value)
          this.flagSuccess = true;
        },
        error => {
          console.log(error);
        }
      );
  }
}
