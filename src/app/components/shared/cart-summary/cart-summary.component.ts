import {Component, Input, OnInit} from '@angular/core';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {Cart} from '../../../models/cart';
import {Coupon} from '../../../models/coupon';
import {AppliedCoupon} from '../../../models/appliedCoupon';

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

  removeRetreatFromCart(retreat) {
    this.cartService.removeRetreat(retreat.id);
  }

  removeCouponFromCart(coupon) {
    this.cartService.removeCoupon(coupon.code);
  }

  getAppliedCoupon(coupon: Coupon) {
    for (const appliedCoupon of this.cart.getAppliedCoupons()) {
      if ( appliedCoupon.coupon.code === coupon.code ) {
        return appliedCoupon;
      }
    }
  }

  isCouponDisabled(coupon) {
    const appliedCoupon = this.getAppliedCoupon(coupon);
    if (appliedCoupon) {
      return appliedCoupon.reason;
    } else {
      return false;
    }
  }
}
