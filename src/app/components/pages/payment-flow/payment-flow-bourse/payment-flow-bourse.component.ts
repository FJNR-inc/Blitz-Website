import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {FormUtil} from '../../../../utils/form';
import {AuthenticationService} from '../../../../services/authentication.service';
import {IUserEdit} from '../../../../models/user';
import {Coupon} from '../../../../models/coupon';
import {UserService} from '../../../../services/user.service';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {AppliedCoupon} from '../../../../models/appliedCoupon';
import {OrderService} from '../../../../services/order.service';
import {Observable} from 'rxjs';
import {Cart} from '../../../../models/cart';

@Component({
  selector: 'app-payment-flow-bourse',
  templateUrl: './payment-flow-bourse.component.html',
  styleUrls: ['./payment-flow-bourse.component.scss']
})
export class PaymentFlowBourseComponent implements OnInit {

  universityForm: FormGroup;
  universityErrors: string[];
  universityFields = [
    {
      name: 'coupon_code',
      type: 'text',
      label: _('retreat-cart.labels.grant_code')
    }
  ];

  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  cart$: Observable<Cart>;
  currentCart: Cart;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private cartService: MyCartService,
              private orderService: OrderService) { }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.cart$.subscribe((cart: Cart) => this.currentCart = cart);
    this.initUniversityForm();
  }

  initUniversityForm() {
    const formUtil = new FormUtil();
    this.universityForm = formUtil.createFormGroup(this.universityFields);
    const profile = this.authenticationService.getProfile();
    const coupons = this.currentCart.getCoupons();
    if (coupons.length > 0) {
      this.universityForm.controls['coupon_code'].setValue(coupons[0].code);
    }
  }

  submitUniversityInformation() {
    const temporaryCart = this.currentCart;

    if (!this.universityForm.controls['coupon_code'].value) {
      temporaryCart.removeCoupon();
    } else {
      const newCoupon = new Coupon({
          code: this.universityForm.controls['coupon_code'].value
        }
      );
      temporaryCart.addCoupon(newCoupon);
    }

    this.refreshCouponUsage(temporaryCart);
  }

  canAddAGrant() {
    return FormUtil.isCompleted(this.universityForm, this.universityFields);
  }

  goBack() {
    this.back.emit();
  }

  goForward() {
    this.submitUniversityInformation();
  }

  refreshCouponUsage(temporaryCart) {
    if (temporaryCart.getCoupons().length) {
      this.orderService.validate(temporaryCart.generateOrder()).subscribe(
        data => {

          const newAppliedCoupon = new AppliedCoupon(data);
          newAppliedCoupon.coupon = temporaryCart.getCoupons()[0];
          this.cartService.setAppliedCoupon(newAppliedCoupon);
          this.forward.emit();
        },
        err => {
          if (err.error.non_field_errors) {
            this.universityErrors = err.error.non_field_errors;
          } else if (err.error.coupon) {
            this.universityErrors = err.error.coupon;
          }

          this.cartService.removeAppliedCoupon();
        }
      );
    } else {
      this.cartService.removeAppliedCoupon();
      this.forward.emit();
    }
  }
}
