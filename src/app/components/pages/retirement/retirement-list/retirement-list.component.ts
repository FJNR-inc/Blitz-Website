import {Component, Input, OnInit} from '@angular/core';
import {RetirementService} from '../../../../services/retirement.service';
import {Retirement} from '../../../../models/retirement';
import {AuthenticationService} from '../../../../services/authentication.service';
import {RetirementReservation} from '../../../../models/retirementReservation';
import {RetirementReservationService} from '../../../../services/retirement-reservation.service';
import {RetirementWaitingQueueService} from '../../../../services/retirementWaitingQueue.service';
import {RetirementWaitingQueue} from '../../../../models/retirementWaitingQueue';
import {RetirementWaitingQueueNotificationService} from '../../../../services/retirementWaitingQueueNotification.service';
import {RetirementWaitingQueueNotification} from '../../../../models/retirementWaitingQueueNotification';

@Component({
  selector: 'app-retirement-list',
  templateUrl: './retirement-list.component.html',
  styleUrls: ['./retirement-list.component.scss']
})
export class RetirementListComponent implements OnInit {

  retirements: Retirement[];
  retirementWaitingQueues: RetirementWaitingQueue[];
  retirementWaitingQueueNotifications: RetirementWaitingQueueNotification[];

  @Input() retirementReservations: RetirementReservation[];

  constructor(private retirementService: RetirementService,
              private authenticationService: AuthenticationService,
              private retirementReservationService: RetirementReservationService,
              private retirementWaitingQueueService: RetirementWaitingQueueService,
              private retirementWaitingQueueNotificationService: RetirementWaitingQueueNotificationService) { }

  ngOnInit() {
    this.refreshContent();
  }

  refreshContent() {
    this.refreshRetirements();
    if (this.authenticationService.isAuthenticated()) {
      this.refreshRetirementWaitingQueue();
      this.refreshRetirementWaitingQueueNotification();
    }
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
      data => {
        this.retirements = data.results.map(r => new Retirement(r));
      }
    );
  }

  refreshRetirementWaitingQueue() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      }
    ];
    this.retirementWaitingQueueService.list(filters).subscribe(
      data => {
        this.retirementWaitingQueues = data.results.map(r => new RetirementReservation(r));
      }
    );
  }

  refreshRetirementWaitingQueueNotification() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      }
    ];
    this.retirementWaitingQueueNotificationService.list(filters).subscribe(
      data => {
        this.retirementWaitingQueueNotifications = data.results.map(r => new RetirementWaitingQueueNotification(r));
      }
    );
  }

  isAlreadyReserved(retirement) {
    if ( this.retirementReservations ) {
      for (const reservation of this.retirementReservations) {
        if (reservation.retirement === retirement.url) {
          return true;
        }
      }
    }
    return false;
  }

  isAlreadyInQueue(retirement) {
    if ( this.retirementWaitingQueues ) {
      for (const queue of this.retirementWaitingQueues) {
        if (queue.retirement === retirement.url) {
          return true;
        }
      }
    }
    return false;
  }

  isNotified(retirement) {
    if ( this.retirementWaitingQueueNotifications ) {
      for (const notification of this.retirementWaitingQueueNotifications) {
        if (notification.retirement === retirement.url) {
          return true;
        }
      }
    }
    return false;
  }
}
