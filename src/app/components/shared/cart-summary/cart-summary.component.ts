import {Component, Input, OnInit} from '@angular/core';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {Cart} from '../../../models/cart';
import {Coupon} from '../../../models/coupon';
import {AuthenticationService} from '../../../services/authentication.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent implements OnInit {

  @Input() displayPrice = true;
  @Input() displayTitle = true;
  @Input() displayCoupon = true;

  cart: Cart;
  cart$: Observable<Cart>;

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.cart$.subscribe(
      (cart: Cart) => this.cart = cart
    );
  }

  removeMembershipFromCart(membership) {
    this.cartService.removeMembership(membership.id);
  }

  removeRetreatFromCart(retreat) {
    this.cartService.removeRetreat(retreat.id);
  }

  removeReservationPackageFromCart(reservationPackage) {
    this.cartService.removeReservationPackage(reservationPackage.id);
  }

  removeTimeslotFromCart(timeslot) {
    this.cartService.removeTimeslot(timeslot.id);
  }

  removeCouponFromCart() {
    this.cartService.removeCoupon();
    this.cartService.removeAppliedCoupon();
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

  getActualTotalTicket() {
    const user = this.authenticationService.getProfile();
    if (user) {
      return user.tickets;
    } else {
      return null;
    }
  }

  getNewTotalTicket() {
    const total = this.getActualTotalTicket();
    if (total) {
      return total + this.cart.getDifferenceOfTicket();
    } else {
      return null;
    }
  }

  cleanCart() {
    this.cartService.cleanLocalCart();
  }

}
