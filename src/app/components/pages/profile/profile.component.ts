import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { ProfileService } from '../../../services/profile.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: User;

  settings = {
    removeButton: true,
    columns: [
      {
        name: 'workplace',
        title: 'Espace de travail'
      },
      {
        name: 'start_event',
        title: 'Plage horaire'
      }
    ]
  };

  fakeData = [
    {
      workplace: 'Espace della vitta',
      start_event: 'Samedi 23 juin 2018 (09 h 00 - 12 h 00) ',
    },
    {
      workplace: 'Espace della vitta',
      start_event: 'Dimanche 24 juin 2018 (14 h 00 - 17 h 00) ',
    },
  ];

  constructor(private profileService: ProfileService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.profileService.get().subscribe(
      profile => {
        this.authenticationService.setProfile(profile);
        this.profile = new User(this.authenticationService.getProfile());
        this.authenticationService.profile.subscribe(
          emitedProfile => this.profile = new User(emitedProfile)
        );
      }
    );
  }

}
