import { Component, OnInit } from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Cart} from '../../../../models/cart';
import {RetreatReservation} from '../../../../models/retreatReservation';
import {AuthenticationService} from '../../../../services/authentication.service';
import {RetreatReservationService} from '../../../../services/retreat-reservation.service';

@Component({
  selector: 'app-retreat-reservation',
  templateUrl: './retreat-reservation.component.html',
  styleUrls: ['./retreat-reservation.component.scss']
})
export class RetreatReservationComponent implements OnInit {

  displayTutorial = true;
  currentView: 'cart'|'list' = 'list';

  retreatReservations: RetreatReservation[];

  cart: Cart;

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService,
              private retreatReservationService: RetreatReservationService) {
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
    this.cartService.reset();
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

  changeCurrentView(view) {
    this.currentView = view;
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
}
