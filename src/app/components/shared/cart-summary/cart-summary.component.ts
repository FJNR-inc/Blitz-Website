import {Component, Input, OnInit} from '@angular/core';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {Cart} from '../../../models/cart';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent implements OnInit {

  @Input() cart: Cart;

  constructor(private cartService: MyCartService) { }

  ngOnInit() {
  }

  removeMembershipFromCart(membership) {
    this.cartService.removeMembership(membership.id);
  }

  removeRetirementFromCart(retirement) {
    this.cartService.removeRetirement(retirement.id);
  }

  removeCouponFromCart(coupon) {
    this.cartService.removeCoupon(coupon.code);
  }
}
