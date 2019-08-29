import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {Cart} from '../../../models/cart';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss']
})
export class CartButtonComponent implements OnInit {

  cart: Cart;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cartService: MyCartService) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
      }
    );
  }

  ngOnInit() {
  }

  clicked() {
    this.onClick.emit();
  }
}
