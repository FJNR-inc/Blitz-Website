import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { ProfileService } from '../../../services/profile.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {TimeSlotService} from "../../../services/time-slot.service";
import {TimeSlot} from "../../../models/timeSlot";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: User;

  settings = {
    removeButton: true,
    title: 'Mes réservations',
    columns: [
      {
        name: 'start_event',
        title: 'Plage horaire'
      }
    ]
  };

  listReservations: any[];

  constructor(private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private timeSlotService: TimeSlotService) { }

  ngOnInit() {
    this.profileService.get().subscribe(
      profile => {
        this.authenticationService.setProfile(profile);
        this.profile = new User(this.authenticationService.getProfile());
        this.authenticationService.profile.subscribe(
          emitedProfile => this.profile = new User(emitedProfile)
        );
        this.refreshReservation();
      }
    );
  }

  refreshReservation() {
    this.timeSlotService.list([{'name': 'user', 'value': this.profile.id}]).subscribe(
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
