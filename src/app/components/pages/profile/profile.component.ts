import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { ProfileService } from '../../../services/profile.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { TimeSlotService } from '../../../services/time-slot.service';
import { TimeSlot } from '../../../models/timeSlot';
import { UserService } from '../../../services/user.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: User;

  settings = {
    noDataText: 'Aucune réservation pour le moment',
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
              private timeSlotService: TimeSlotService,
              private userService: UserService,
              private notificationService: NotificationsService,
              private router: Router) { }

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

  deactivateAccount() {
    this.userService.remove(this.profile).subscribe(
      data => {
        this.notificationService.success('Désactivé', 'Votre compte a bien été désactivé.');
        this.router.navigate(['/logout']);
      },
      err => {
        this.notificationService.error('Erreur', 'Echec de la tentative de désactivation.');
      }
    );
  }
}
