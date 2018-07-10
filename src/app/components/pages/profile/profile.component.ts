import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { ProfileService } from '../../../services/profile.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { TimeSlotService } from '../../../services/time-slot.service';
import { TimeSlot } from '../../../models/timeSlot';
import { UserService } from '../../../services/user.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../services/my-modal/my-modal.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: User;
  userForm: FormGroup;
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
  errors: string[];

  constructor(private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private timeSlotService: TimeSlotService,
              private userService: UserService,
              private notificationService: NotificationsService,
              private router: Router,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService) { }

  ngOnInit() {
    this.refreshProfile();
  }

  resetForm() {
    this.userForm = this.formBuilder.group(
      {
        first_name: this.profile.first_name,
        last_name: this.profile.last_name,
        gender: this.profile.gender,
        birthdate: this.profile.getBirthdate(),
      }
    );
  }

  refreshProfile() {
    this.profileService.get().subscribe(
      profile => {
        this.authenticationService.setProfile(profile);
        this.profile = new User(this.authenticationService.getProfile());
        this.authenticationService.profile.subscribe(
          emitedProfile => this.profile = new User(emitedProfile)
        );
        this.refreshReservation();
        this.resetForm();
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

  submitProfile() {
    if ( this.userForm.valid ) {
      const value = this.userForm.value;
      if (this.userForm.controls['birthdate']) {
        const birthdate = this.userForm.controls['birthdate'].value.toISOString().substr(0, 10);
        value['birthdate'] = birthdate;
      }
      this.userService.update(this.profile.url, value).subscribe(
        data => {
          this.notificationService.success('Ajouté');
          this.refreshProfile();
          this.toogleModal('form_user');
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          }
          if (err.error.first_name) {
            this.userForm.controls['first_name'].setErrors({
              apiError: err.error.first_name
            });
          }
          if (err.error.last_name) {
            this.userForm.controls['last_name'].setErrors({
              apiError: err.error.last_name
            });
          }
          if (err.error.birthdate) {
            this.userForm.controls['birthdate'].setErrors({
              apiError: err.error.birthdate
            });
          }
          if (err.error.gender) {
            this.userForm.controls['gender'].setErrors({
              apiError: err.error.gender
            });
          }
        }
      );
    }
  }

  toogleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }
    modal.toggle();
  }
}
