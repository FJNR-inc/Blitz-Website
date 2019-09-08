import { Component, OnInit } from '@angular/core';
import {Retreat} from '../../../models/retreat';
import {AuthenticationService} from '../../../services/authentication.service';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {Cart} from '../../../models/cart';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RetreatInvitationService} from '../../../services/retreatInvitation.service';
import {RetreatService} from '../../../services/retreat.service';
import {Coupon} from '../../../models/coupon';

@Component({
  selector: 'app-hidden-retreat',
  templateUrl: './hidden-retreat.component.html',
  styleUrls: ['./hidden-retreat.component.scss']
})
export class HiddenRetreatComponent implements OnInit {

  retreat: Retreat;
  invitation: any;
  cart: Cart;
  coupon: Coupon;

  displayedPanel: 'authentication' | 'product-selector' | 'cart';

  constructor(private retreatInvitationService: RetreatInvitationService,
              private retreatService: RetreatService,
              private authenticationService: AuthenticationService,
              private cartService: MyCartService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
      }
    );
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const token = params['token'];
      this.retreatInvitationService.list([{name: 'url_token', value: token}]).subscribe(
        data => {
          if (data.count > 0) {
            this.invitation = data.results[0];
            this.retreat = new Retreat(this.invitation.retreat);
            this.coupon = new Coupon(this.invitation.coupon);
          } else {
            this.router.navigate(['/404']);
          }
        }
      );
    });
  }

  closePanel() {
    this.displayedPanel = null;
  }

  subscribe() {
    if (this.authenticationService.isAuthenticated()) {
      this.displayedPanel = 'product-selector';
    } else {
      this.displayedPanel = 'authentication';
    }
  }

  addToCart() {
    this.cartService.setMetadata(this.retreat, this.generateMetaData());
    this.cartService.addCoupon(this.coupon);
    this.displayedPanel = 'cart';
  }

  finalize() {
    this.router.navigate(['/payment']);
  }

  generateMetaData() {
    return {
      'invitation_id': this.invitation.id
    };
  }
}
