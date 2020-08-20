import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Retreat} from '../../../../models/retreat';
import {RetreatReservation} from '../../../../models/retreatReservation';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {RetreatService} from '../../../../services/retreat.service';
import {RetreatReservationService} from '../../../../services/retreat-reservation.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-profile-retreats',
  templateUrl: './profile-retreats.component.html',
  styleUrls: ['./profile-retreats.component.scss']
})
export class ProfileRetreatsComponent implements OnInit {

  listRetreats: Retreat[];
  selectedRetreatReservation: RetreatReservation;
  errorCancelationRetreatReservation = null;
  errorExchangeRetreatReservation = null;
  selectedRetreatForExchange: string;

  listRetreatReservations: RetreatReservation[];
  listFutureRetreatReservations: RetreatReservation[];
  totalPastRetreatReservations = 0;
  totalFutureRetreatReservations = 0;
  listReservationToAdmin: RetreatReservation[] = [];

  displayAllRetreatReservation = false;
  retreatReservationOpen: number;

  @Input() type: 'virtual' | 'physical';

  @Output() totalPastTomatoes: EventEmitter<any> = new EventEmitter();
  @Output() totalFutureTomatoes: EventEmitter<any> = new EventEmitter();
  @Output() openVirtualReservation: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;

  constructor(private retreatService: RetreatService,
              private retreatReservationService: RetreatReservationService,
              private authenticationService: AuthenticationService,
              private myModalService: MyModalService,
              private router: Router,
              private notificationService: MyNotificationService) { }

  ngOnInit() {
    this.refreshRetreatReservation();
  }

  refreshRetreats() {
    const now = new Date().toISOString();
    const filters = [
      {
        'name': 'is_active',
        'value': true
      },
      {
        'name': 'end_time__gte',
        'value': now
      },
      {
        'name': 'type',
        'value': this.selectedRetreatReservation.retreat_details.type.id
      }
    ];
    this.retreatService.list(filters).subscribe(
      reservations => {
        this.listRetreats = reservations.results.map(
          r => new Retreat(r)
        );
      }
    );
  }

  refreshRetreatReservation() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      },
      {
        'name': 'is_active',
        'value': true
      },
      {
        'name': 'retreat__type__is_virtual',
        'value': this.type === 'virtual'
      }
    ];
    this.retreatReservationService.list(filters).subscribe(
      retreatReservations => {
        const listRetreatReservations = retreatReservations.results.map(
          r => new RetreatReservation(r)
        );

        this.totalPastRetreatReservations = 0;
        this.totalFutureRetreatReservations = 0;
        this.listRetreatReservations = [];
        this.listFutureRetreatReservations = [];

        for ( const retreatReservation of listRetreatReservations ) {
          if (retreatReservation.retreat_details.getEndDate() < new Date()) {
            this.totalPastRetreatReservations += environment.tomato_per_physical_retreat;
          } else {
            this.totalFutureRetreatReservations += environment.tomato_per_physical_retreat;
            this.listFutureRetreatReservations.push(retreatReservation);
          }

          if (retreatReservation.order_line == null) {
            this.listReservationToAdmin.push(retreatReservation);
          }
          this.listRetreatReservations.push(retreatReservation);
        }

        this.totalPastTomatoes.emit(this.totalPastRetreatReservations);
        this.totalFutureTomatoes.emit(this.totalFutureRetreatReservations);

        for (const reservation of this.listRetreatReservations) {
          if (reservation.retreat_details.isOpen) {
            this.openVirtualReservation.emit(reservation);
          }
        }
      }
    );
  }

  isAdminReservation (retreatReservationArg) {
    return !!this.listReservationToAdmin.find(function(retreatReservation) {
      return retreatReservation.id === retreatReservationArg.id;
    });
  }

  getDisplayedRetreatReservation() {
    if (this.displayAllRetreatReservation) {
      return this.listRetreatReservations;
    } else if (this.listFutureRetreatReservations) {
      return this.listFutureRetreatReservations;
    } else {
      return null;
    }
  }

  setDisplayAllRetreatReservation(value) {
    this.displayAllRetreatReservation = value;
  }

  openRetreatReservation(id: number) {
    if (this.retreatReservationOpen === id) {
      this.retreatReservationOpen = null;
    } else {
      this.retreatReservationOpen = id;
    }
  }

  openModalExchangeRetreatReservation(selectedRetreatReservation) {
    this.selectedRetreatReservation = selectedRetreatReservation;
    this.selectedRetreatForExchange = this.getChoicesExchangeRetreat()[0].url;
    this.refreshRetreats();
    this.toogleModal('form_exchange_retreat');
  }

  openModalCancelRetreatReservation(selectedRetreatReservation) {
    this.errorCancelationRetreatReservation = null;
    this.selectedRetreatReservation = selectedRetreatReservation;
    this.toogleModal('form_cancel_reservation_retreat');
  }

  getChoicesExchangeRetreat() {
    if (this.listRetreats) {
      const list = [];
      for (const retreat of this.listRetreats) {
        if (retreat.id !== this.selectedRetreatReservation.retreat_details.id) {
          if (retreat.places_remaining > 0) {
            list.push(retreat);
          }
        }
      }
      return list;
    } else {
      return [];
    }
  }

  // Use to stop the event, and not open the detail of retreat
  // when we open the menu (made with [matMenuTriggerFor]="optionsRetreat")
  stopPropagation(event) {
    event.stopPropagation();
  }

  exchangeRetreat() {
    const reservation = new RetreatReservation();
    reservation.retreat = this.selectedRetreatForExchange;
    this.retreatReservationService.update(this.selectedRetreatReservation.url, reservation).subscribe(
      data => {
        this.notificationService.success(
          _('profile-retreats.notifications.exchange_retreat_reservation.title'),
          _('profile-retreats.notifications.exchange_retreat_reservation.content')
        );
        this.refreshRetreatReservation();
        this.toogleModal('form_exchange_retreat');
      },
      err => {
        if (err.error.non_field_errors) {
          this.errorExchangeRetreatReservation = err.error.non_field_errors;
        } else {
          this.errorExchangeRetreatReservation = [_('profile-retreats.alert.errors.unknown')];
        }
      }
    );
  }

  cancelRetreat() {
    this.retreatReservationService.remove(this.selectedRetreatReservation).subscribe(
      data => {
        this.notificationService.success(
          _('profile-retreats.notifications.cancel_retreat_reservation.title'),
          _('profile-retreats.notifications.cancel_retreat_reservation.content')
        );
        this.refreshRetreatReservation();
        this.toogleModal('form_cancel_reservation_retreat');
      },
      err => {
        if (err.error.non_field_errors) {
          this.errorCancelationRetreatReservation = err.error.non_field_errors;
        } else {
          this.errorCancelationRetreatReservation = [_('profile-retreats.alert.errors.unknown')];
        }
      }
    );
  }

  toogleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      return;
    }
    modal.toggle();
  }
}
