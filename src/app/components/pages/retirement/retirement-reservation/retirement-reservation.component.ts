import { Component, OnInit } from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Cart} from '../../../../models/cart';
import {RetirementReservation} from '../../../../models/retirementReservation';
import {AuthenticationService} from '../../../../services/authentication.service';
import {RetirementReservationService} from '../../../../services/retirement-reservation.service';

@Component({
  selector: 'app-retirement-reservation',
  templateUrl: './retirement-reservation.component.html',
  styleUrls: ['./retirement-reservation.component.scss']
})
export class RetirementReservationComponent implements OnInit {

  displayTutorial = true;
  currentView: 'cart'|'list' = 'list';

  retirementReservations: RetirementReservation[];

  cart: Cart;

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService,
              private retirementReservationService: RetirementReservationService) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
      }
    );
  }

  ngOnInit() {
    this.cartService.reset();
    this.refreshRetirementReservations();
  }

  updateTutorialDisplay(numberOfRetirementReservations) {
    if (numberOfRetirementReservations >= 2) {
      this.closeTutorial();
    } else {
      this.openTutorial();
    }
  }

  openTutorial() {
    this.displayTutorial = true;
  }

  closeTutorial() {
    this.displayTutorial = false;
  }

  changeCurrentView(view) {
    this.currentView = view;
  }

  refreshRetirementReservations() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      }
    ];
    this.retirementReservationService.list(filters).subscribe(
      data => {
        this.retirementReservations = data.results.map(r => new RetirementReservation(r));
        this.updateTutorialDisplay(this.retirementReservations.length);
      }
    );
  }
}
