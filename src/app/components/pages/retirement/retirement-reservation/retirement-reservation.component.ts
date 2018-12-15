import { Component, OnInit } from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Cart} from '../../../../models/cart';

@Component({
  selector: 'app-retirement-reservation',
  templateUrl: './retirement-reservation.component.html',
  styleUrls: ['./retirement-reservation.component.scss']
})
export class RetirementReservationComponent implements OnInit {

  displayTutorial = true;
  currentView: 'cart'|'list' = 'list';

  cart: Cart;

  constructor(private cartService: MyCartService) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
        console.log(this.cart);
      }
    );
  }

  ngOnInit() {
    this.cartService.reset();
  }

  closeTutorial() {
    this.displayTutorial = false;
  }

  changeCurrentView(view) {
    this.currentView = view;
  }
}
