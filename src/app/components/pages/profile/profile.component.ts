import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { ProfileService } from '../../../services/profile.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { TimeSlotService } from '../../../services/time-slot.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../services/my-modal/my-modal.service';
import { Card } from '../../../models/card';
import { CardService } from '../../../services/card.service';
import {WorkplaceService} from '../../../services/workplace.service';
import {Workplace} from '../../../models/workplace';
import {Reservation} from '../../../models/reservation';
import {ReservationService} from '../../../services/reservation.service';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {RetirementReservationService} from '../../../services/retirement-reservation.service';
import {RetirementReservation} from '../../../models/retirementReservation';
import {Retirement} from '../../../models/retirement';
import {RetirementService} from '../../../services/retirement.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: User;
  userForm: FormGroup;
  settings = {
    noDataText: _('profile.no_reservation_for_the_moment'),
    removeButton: true,
    title: _('profile.my_reservation'),
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

  listRetirementReservations: RetirementReservation[];
  listFutureRetirementReservations: RetirementReservation[];
  totalPastRetirementReservations = 0;
  totalFutureRetirementReservations = 0;

  listRetirements: Retirement[];
  selectedRetirementReservation: RetirementReservation;
  errorCancelationRetirementReservation = null;
  errorExchangeRetirementReservation = null;
  selectedRetirementForExchange: string;

  listCards: Card[];
  listWorkplaces: Workplace[];
  errors: string[];

  displayAll = false;
  displayAllRetirementReservation = false;

  reservationInCancelation: Reservation = null;

  retirementReservationOpen: number;

  constructor(private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private timeSlotService: TimeSlotService,
              private userService: UserService,
              private notificationService: MyNotificationService,
              private router: Router,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService,
              private cardService: CardService,
              private workplaceService: WorkplaceService,
              private reservationService: ReservationService,
              private retirementReservationService: RetirementReservationService,
              private retirementService: RetirementService) { }

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
        this.refreshRetirementReservation();
        this.refreshListCard();
        this.refreshListWorkplace();
        this.resetForm();
      }
    );
  }

  refreshRetirements() {
    const now = new Date().toISOString();
    const filters = [
      {
        'name': 'is_active',
        'value': true
      },
      {
        'name': 'end_time__gte',
        'value': now
      }
    ];
    this.retirementService.list(filters).subscribe(
      reservations => {
        this.listRetirements = reservations.results.map(
          r => new Retirement(r)
        );
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

  refreshRetirementReservation() {
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
    this.retirementReservationService.list(filters).subscribe(
      retirementReservations => {
        const listRetirementReservations = retirementReservations.results.map(
          r => new RetirementReservation(r)
        );

        this.totalPastRetirementReservations = 0;
        this.totalFutureRetirementReservations = 0;
        this.listRetirementReservations = [];
        this.listFutureRetirementReservations = [];

        for ( const retirementReservation of listRetirementReservations ) {
          if (retirementReservation.retirement_details.getEndDate() < new Date()) {
            this.totalPastRetirementReservations += 20;
          } else {
            this.totalFutureRetirementReservations += 20;
            this.listFutureRetirementReservations.push(retirementReservation);
          }
          this.listRetirementReservations.push(retirementReservation);
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

  getDisplayedRetirementReservation() {
    if (this.displayAllRetirementReservation) {
      return this.listRetirementReservations;
    } else if (this.listFutureRetirementReservations) {
      return this.listFutureRetirementReservations;
    } else {
      return false;
    }
  }

  setDisplayAll(value) {
    this.displayAll = value;
  }

  setDisplayAllRetirementReservation(value) {
    this.displayAllRetirementReservation = value;
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
          _('shared.notifications.deactivate_profile.title'),
          _('shared.notifications.deactivate_profile.content')
        );
        this.router.navigate(['/logout']);
      },
      err => {
        this.notificationService.error(
          _('shared.notifications.fail_deactivation.title'),
          _('shared.notifications.fail_deactivation.content')
        );
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
          this.notificationService.success(_('shared.notifications.commons.added.title'));
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
        this.notificationService.success(
          _('shared.notifications.cancel_bloc.title'),
          _('shared.notifications.cancel_bloc.content')
        );
        this.refreshReservation();
      },
      err => {
        this.notificationService.error(
          _('shared.notifications.fail_cancel_bloc.title'),
          _('shared.notifications.fail_cancel_bloc.content')
        );
      }
    );
  }

  getTotalEarnTomatoes() {
    return this.totalPastReservations + this.totalPastRetirementReservations;
  }

  getTotalFutureTomatoes() {
    return this.totalFutureReservations + this.totalFutureRetirementReservations;
  }

  openRetirementReservation(id: number) {
    if (this.retirementReservationOpen === id) {
      this.retirementReservationOpen = null;
    } else {
      this.retirementReservationOpen = id;
    }
  }

  openModalExchangeRetirementReservation(selectedRetirementReservation) {
    this.selectedRetirementReservation = selectedRetirementReservation;
    this.refreshRetirements();
    this.toogleModal('form_exchange_retirement');
  }

  openModalCancelRetirementReservation(selectedRetirementReservation) {
    this.errorCancelationRetirementReservation = null;
    this.selectedRetirementReservation = selectedRetirementReservation;
    this.toogleModal('form_cancel_reservation_retirement');
  }

  getChoicesExchangeRetirement() {
    if (this.listRetirements) {
      const list = [];
      for (const retirement of this.listRetirements) {
        if (retirement.id !== this.selectedRetirementReservation.retirement_details.id) {
          list.push(retirement);
        }
      }
      return list;
    } else {
      return [];
    }
  }

  exchangeRetirement() {
    const reservation = new RetirementReservation();
    reservation.retirement = this.selectedRetirementForExchange;
    this.retirementReservationService.update(this.selectedRetirementReservation.url, reservation).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.exchange_retirement_reservation.title'),
          _('shared.notifications.exchange_retirement_reservation.content')
        );
        this.refreshRetirementReservation();
        this.toogleModal('form_exchange_retirement');
      },
      err => {
        if (err.error.non_field_errors) {
          this.errorExchangeRetirementReservation = err.error.non_field_errors;
        } else {
          this.errorExchangeRetirementReservation = [_('shared.alert.errors.unknown')];
        }
      }
    );
  }

  cancelRetirement() {
    this.retirementReservationService.remove(this.selectedRetirementReservation).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.cancel_retirement_reservation.title'),
          _('shared.notifications.cancel_retirement_reservation.content')
        );
        this.refreshRetirementReservation();
        this.toogleModal('form_cancel_reservation_retirement');
      },
      err => {
        if (err.error.non_field_errors) {
          this.errorCancelationRetirementReservation = err.error.non_field_errors;
        } else {
          this.errorCancelationRetirementReservation = [_('shared.alert.errors.unknown')];
        }
      }
    );
  }
}
