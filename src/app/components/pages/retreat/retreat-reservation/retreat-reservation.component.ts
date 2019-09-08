import { Component, OnInit } from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Cart} from '../../../../models/cart';
import {RetreatReservation} from '../../../../models/retreatReservation';
import {AuthenticationService} from '../../../../services/authentication.service';
import {RetreatReservationService} from '../../../../services/retreat-reservation.service';
import {Retreat} from '../../../../models/retreat';
import {RetreatWaitingQueueNotification} from '../../../../models/retreatWaitingQueueNotification';
import {RetreatWaitingQueue} from '../../../../models/retreatWaitingQueue';
import {RetreatService} from '../../../../services/retreat.service';
import {RetreatWaitingQueueService} from '../../../../services/retreatWaitingQueue.service';
import {RetreatWaitingQueueNotificationService} from '../../../../services/retreatWaitingQueueNotification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-retreat-reservation',
  templateUrl: './retreat-reservation.component.html',
  styleUrls: ['./retreat-reservation.component.scss']
})
export class RetreatReservationComponent implements OnInit {

  displayTutorial = true;
  retreats: Retreat[];
  retreatWaitingQueues: RetreatWaitingQueue[];
  retreatWaitingQueueNotifications: RetreatWaitingQueueNotification[];

  retreatReservations: RetreatReservation[];

  cart: Cart;

  selectedRetreat: Retreat;
  displayedPanel: 'authentication' | 'product-selector' | 'cart';

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService,
              private retreatReservationService: RetreatReservationService,
              private retreatService: RetreatService,
              private retreatWaitingQueueService: RetreatWaitingQueueService,
              private retreatWaitingQueueNotificationService: RetreatWaitingQueueNotificationService,
              private router: Router) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
      }
    );

    this.authenticationService.profile.subscribe(
      emitedProfile => {
        this.refreshRetreatReservations();
      }
    );
  }

  ngOnInit() {
    this.refreshContent();
    if (this.authenticationService.isAuthenticated()) {
      this.refreshRetreatReservations(true);
    }
  }

  updateTutorialDisplay(numberOfRetreatReservations) {
    if (numberOfRetreatReservations >= 2) {
      this.closeTutorial();
    } else {
      this.openTutorial();
    }
  }

  openTutorial() {
    this.displayTutorial = true;
    console.log('Open the tutorial!');
  }

  closeTutorial() {
    this.displayTutorial = false;
  }

  refreshRetreatReservations(refreshTutorial = false) {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      },
      {
        'name': 'is_active',
        'value': true
      }
    ];
    this.retreatReservationService.list(filters).subscribe(
      data => {
        this.retreatReservations = data.results.map(r => new RetreatReservation(r));
        if (refreshTutorial) {
          this.updateTutorialDisplay(this.retreatReservations.length);
        }
      }
    );
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
      },
      {
        'name': 'hidden',
        'value': false
      },
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

  closePanel() {
    this.displayedPanel = null;
  }

  subscribe(retreat) {
    this.selectedRetreat = retreat;
    if (this.authenticationService.isAuthenticated()) {
      this.displayedPanel = 'product-selector';
    } else {
      this.displayedPanel = 'authentication';
    }
  }

  addToCart() {
    this.openCart();
  }

  openCart() {
    this.displayedPanel = 'cart';
  }

  finalize() {
    this.router.navigate(['/payment']);
  }
}
