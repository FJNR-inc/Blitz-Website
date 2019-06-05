import {Component, Input, OnInit} from '@angular/core';
import {RetreatService} from '../../../../services/retreat.service';
import {Retreat} from '../../../../models/retreat';
import {AuthenticationService} from '../../../../services/authentication.service';
import {RetreatReservation} from '../../../../models/retreatReservation';
import {RetreatReservationService} from '../../../../services/retreat-reservation.service';
import {RetreatWaitingQueueService} from '../../../../services/retreatWaitingQueue.service';
import {RetreatWaitingQueue} from '../../../../models/retreatWaitingQueue';
import {RetreatWaitingQueueNotificationService} from '../../../../services/retreatWaitingQueueNotification.service';
import {RetreatWaitingQueueNotification} from '../../../../models/retreatWaitingQueueNotification';

@Component({
  selector: 'app-retreat-list',
  templateUrl: './retreat-list.component.html',
  styleUrls: ['./retreat-list.component.scss']
})
export class RetreatListComponent implements OnInit {

  retreats: Retreat[];
  retreatWaitingQueues: RetreatWaitingQueue[];
  retreatWaitingQueueNotifications: RetreatWaitingQueueNotification[];

  @Input() retreatReservations: RetreatReservation[];

  constructor(private retreatService: RetreatService,
              private authenticationService: AuthenticationService,
              private retreatReservationService: RetreatReservationService,
              private retreatWaitingQueueService: RetreatWaitingQueueService,
              private retreatWaitingQueueNotificationService: RetreatWaitingQueueNotificationService) { }

  ngOnInit() {
    this.refreshContent();
  }

  refreshContent() {
    this.refreshRetreats();
    if (this.authenticationService.isAuthenticated()) {
      this.refreshRetreatWaitingQueue();
      this.refreshRetreatWaitingQueueNotification();
    }
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
      }
    ];
    this.retreatService.list(filters).subscribe(
      data => {
        this.retreats = data.results.map(r => new Retreat(r));
      }
    );
  }

  refreshRetreatWaitingQueue() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      }
    ];
    this.retreatWaitingQueueService.list(filters).subscribe(
      data => {
        this.retreatWaitingQueues = data.results.map(r => new RetreatReservation(r));
      }
    );
  }

  refreshRetreatWaitingQueueNotification() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      }
    ];
    this.retreatWaitingQueueNotificationService.list(filters).subscribe(
      data => {
        this.retreatWaitingQueueNotifications = data.results.map(r => new RetreatWaitingQueueNotification(r));
      }
    );
  }

  isAlreadyReserved(retreat) {
    if ( this.retreatReservations ) {
      for (const reservation of this.retreatReservations) {
        if (reservation.retreat === retreat.url) {
          return true;
        }
      }
    }
    return false;
  }

  isAlreadyInQueue(retreat) {
    if ( this.retreatWaitingQueues ) {
      for (const queue of this.retreatWaitingQueues) {
        if (queue.retreat === retreat.url) {
          return true;
        }
      }
    }
    return false;
  }

  isNotified(retreat) {
    if ( this.retreatWaitingQueueNotifications ) {
      for (const notification of this.retreatWaitingQueueNotifications) {
        if (notification.retreat === retreat.url) {
          return true;
        }
      }
    }
    return false;
  }
}
