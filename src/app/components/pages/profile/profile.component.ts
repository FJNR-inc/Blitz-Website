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
import { Card } from '../../../models/card';
import { CardService } from '../../../services/card.service';
import {Time} from '@angular/common';
import {WorkplaceService} from '../../../services/workplace.service';
import {Workplace} from '../../../models/workplace';
import {Reservation} from '../../../models/reservation';
import {ReservationService} from '../../../services/reservation.service';

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

  listReservations: Reservation[] = [];
  listFutureReservations: Reservation[] = [];
  totalPastReservations = 0;
  totalFutureReservations = 0;
  listCards: Card[];
  listWorkplaces: Workplace[];
  errors: string[];

  displayAll = false;

  reservationInCancelation: Reservation = null;

  constructor(private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private timeSlotService: TimeSlotService,
              private userService: UserService,
              private notificationService: NotificationsService,
              private router: Router,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService,
              private cardService: CardService,
              private workplaceService: WorkplaceService,
              private reservationService: ReservationService) { }

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
        this.refreshListCard();
        this.refreshListWorkplace();
        this.resetForm();
      }
    );
  }

  refreshReservation() {
    const filters = [
      {
        'name': 'user',
        'value': this.profile.id
      },
      {
        'name': 'is_active',
        'value': true
      }
    ];
    this.reservationService.list(filters).subscribe(
      reservations => {
        const listReservations = reservations.results.map(
          r => new Reservation(r)
        );

        this.totalPastReservations = 0;
        this.totalFutureReservations = 0;
        this.listReservations = [];
        this.listFutureReservations = [];

        for ( const reservation of listReservations ) {
          if (reservation.timeslot_details.getEndDate() < new Date()) {
            this.totalPastReservations += 4;
          } else {
            this.totalFutureReservations += 4;
            this.listFutureReservations.push(reservation);
          }
          this.listReservations.push(reservation);
        }
      }
    );
  }

  getDisplayedReservation() {
    if (this.displayAll) {
      return this.listReservations;
    } else {
      return this.listFutureReservations;
    }
  }

  setDisplayAll(value) {
    this.displayAll = value;
  }

  refreshListCard() {
    this.cardService.list([{'name': 'owner', 'value': this.profile.id}]).subscribe(
      cards => {
        if (cards.results.length >= 1) {
          this.listCards = cards.results[0].cards.map(c => new Card(c));
        }
      }
    );
  }

  refreshListWorkplace() {
    this.workplaceService.list().subscribe(
      workplaces => {
        if (workplaces.results.length >= 1) {
          this.listWorkplaces = workplaces.results.map(w => new Workplace(w));
        }
      }
    );
  }

  deactivateAccount() {
    this.userService.remove(this.profile).subscribe(
      data => {
        this.notificationService.success(
          'shared.notifications.deactivate_profile.title',
          'shared.notifications.deactivate_profile.content'
        );
        this.router.navigate(['/logout']);
      },
      err => {
        this.notificationService.error('shared.notifications.fail_deactivation.title', 'shared.notifications.fail_deactivation.content');
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
          this.notificationService.success('shared.notifications.commons.added.title');
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

  askToCancelReservation(reservation) {
    this.reservationInCancelation = reservation;
    this.toogleModal('form_cancel_reservation');
  }

  cancelReservation() {
    this.reservationService.remove(this.reservationInCancelation).subscribe(
      data => {
        this.notificationService.success('shared.notifications.cancel_bloc.title', 'shared.notifications.cancel_bloc.content');
        this.refreshReservation();
      },
      err => {
        this.notificationService.error('shared.notifications.fail_cancel.title', 'shared.notifications.fail_cancel.content');
      }
    );
  }
}
