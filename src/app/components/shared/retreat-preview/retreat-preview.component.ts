import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retreat} from '../../../models/retreat';
import {RetreatReservation} from '../../../models/retreatReservation';
import {AuthenticationService} from '../../../services/authentication.service';
import {RetreatService} from '../../../services/retreat.service';
import {RetreatReservationService} from '../../../services/retreat-reservation.service';
import {RetreatWaitingQueueService} from '../../../services/retreatWaitingQueue.service';
import {RetreatWaitingQueue} from '../../../models/retreatWaitingQueue';
import {MyModalService} from '../../../services/my-modal/my-modal.service';
import {RetreatInvitation} from '../../../models/RetreatInvitation';

@Component({
  selector: 'app-retreat-preview',
  templateUrl: './retreat-preview.component.html',
  styleUrls: ['./retreat-preview.component.scss']
})
export class RetreatPreviewComponent implements OnInit {

  @Input() retreat: Retreat;
  @Input() invitation: RetreatInvitation;
  @Input() displaySubscribeButton = false;

  @Output() subscribe: EventEmitter<any> = new EventEmitter();

  displayDetails = false;
  existingReservation: RetreatReservation;
  existingWaitingQueue: RetreatWaitingQueue;
  positionInList = 1;

  constructor(private authenticationService: AuthenticationService,
              private retreatService: RetreatService,
              private retreatReservationService: RetreatReservationService,
              private retreatWaitingQueueService: RetreatWaitingQueueService,
              private modalService: MyModalService) {
    this.authenticationService.profile.subscribe(
      () => {
        this.refreshRetreatReservations();
        this.refreshRetreatWaitingQueue();
      }
    );
  }

  ngOnInit() {
    if (this.authenticationService.isAuthenticated()) {
      this.refreshRetreatReservations();
      this.refreshRetreatWaitingQueue();
    }
  }

  subscribeToRetreat() {
    this.subscribe.emit();
  }

  subscribeToQueue() {
    const retreatWaitingQueue = new RetreatWaitingQueue(
      {
        retreat: this.retreat.url,
        user: this.authenticationService.getProfile().url
      }
    );
    this.retreatWaitingQueueService.create(retreatWaitingQueue).subscribe(
      data => {
        this.positionInList = data.list_size;
        this.modalService.get('waiting-list-success').toggle();
      }
    );
  }

  toggleDetails() {
    this.displayDetails = !this.displayDetails;
  }

  refreshRetreatReservations() {
    const filters = [
      {
        name: 'retreat',
        value: this.retreat.id
      },
      {
        name: 'user',
        value: this.authenticationService.getProfile().id
      },
      {
        name: 'is_active',
        value: true
      }
    ];
    this.retreatReservationService.list(filters).subscribe(
      reservations => {
        if (reservations.count > 0) {
          this.existingReservation = new RetreatReservation(reservations.results[0]);
        }
      }
    );
  }

  refreshRetreatWaitingQueue() {
    const filters = [
      {
        name: 'retreat',
        value: this.retreat.id
      },
      {
        name: 'user',
        value: this.authenticationService.getProfile().id
      }
    ];
    this.retreatWaitingQueueService.list(filters).subscribe(
      waintingQueue => {
        if (waintingQueue.count > 0) {
          this.existingWaitingQueue = new RetreatWaitingQueue(waintingQueue.results[0]);
        }
      }
    );
  }

  get availablePlace() {
    let availablePlace;
    if (this.invitation) {
      availablePlace = Number(this.invitation.nb_places) - Number(this.invitation.nb_places_used);
    } else {
      availablePlace = this.retreat.places_remaining;
    }

    return availablePlace > 0 ? availablePlace : 0;
  }

  canSubscribe() {
    return this.availablePlace > 0 && !this.existingReservation;
  }

  canSubscribeToWaitingQueue() {
    return this.availablePlace <= 0 && !this.existingReservation && !this.existingWaitingQueue;
  }

  get display_wait_queue_button(): boolean{
    // use !! to return only boolean and not undefined for example
    return !!(
      this.displaySubscribeButton &&
      this.canSubscribeToWaitingQueue() && (
        !this.invitation ||
        (this.invitation && !this.invitation.reserve_seat)
      )
    );
  }
}
