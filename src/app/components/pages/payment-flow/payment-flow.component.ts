import { Component, OnInit } from '@angular/core';
import {Cart} from '../../../models/cart';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Step} from './payment-flow-wizard/payment-flow-wizard.component';
import {AppliedCoupon} from '../../../models/appliedCoupon';
import {OrderService} from '../../../services/order.service';

@Component({
  selector: 'app-payment-flow',
  templateUrl: './payment-flow.component.html',
  styleUrls: ['./payment-flow.component.scss']
})
export class PaymentFlowComponent implements OnInit {

  _cart: Cart;
  set cart(cart) {
    this._cart = cart;
    this.refreshCouponUsage();
  }
  get cart() {
    return this._cart;
  }

  membershipStep: Step = {
    'label': 'Membership',
    'id': 'membership'
  };

  informationStep: Step = {
    'label': 'Informations',
    'id': 'informations'
  };

  bourseStep: Step = {
    'label': 'Bourses',
    'id': 'bourses'
  };

  paymentModeStep: Step = {
    'label': 'Mode de paiement',
    'id': 'payment_mode'
  };

  confirmationStep: Step = {
    'label': 'Confirmation',
    'id': 'confirmation'
  };

  steps: Step[] = [
    this.membershipStep,
    this.informationStep,
    this.bourseStep,
    this.paymentModeStep,
    this.confirmationStep,
  ];

  currentStep: Step;

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService,
              private orderService: OrderService) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
      }
    );

    const have_membership = this.authenticationService.getProfile().getTimeBeforeEndMembership() > 0;
    if (have_membership) {
      this.steps.splice(0, 1);
    }

    this.currentStep = this.steps[0];
  }

  ngOnInit() { }

  refreshCouponUsage() {
    if (this.cart.getCoupons().length) {
      this.orderService.validate(this.cart.generateOrder()).subscribe(
        data => {
          const newAppliedCoupon = new AppliedCoupon(data);
          newAppliedCoupon['coupon'] = this.cart.getCoupons()[0];
          this.cart.setAppliedCoupon(newAppliedCoupon);
        },
        err => {
          const newAppliedCoupon = new AppliedCoupon();
          newAppliedCoupon['coupon'] = this.cart.getCoupons()[0];
          if (err.error.non_field_errors) {
            newAppliedCoupon['reason'] = err.error.non_field_errors;
          } else if (err.error.coupon) {
            newAppliedCoupon['reason'] = err.error.coupon[0];
          }
          this.cart.setAppliedCoupon(newAppliedCoupon);
        }
      );
    }
  }

  goBack() {
    this.currentStep = this.steps[this.steps.indexOf(this.currentStep) - 1];
  }

  goForward() {
    this.currentStep = this.steps[this.steps.indexOf(this.currentStep) + 1];
  }
}
