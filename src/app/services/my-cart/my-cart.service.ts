import {EventEmitter, Injectable, Output} from '@angular/core';
import {Order} from '../../models/order';
import {OrderLine} from '../../models/orderLine';
import {Membership} from '../../models/membership';
import {Retirement} from '../../models/retirement';
import {TimeSlot} from '../../models/timeSlot';
import {Cart} from '../../models/cart';


@Injectable({
  providedIn: 'root'
})
export class MyCartService {

  localStorageName = 'cart';

  @Output() cart: EventEmitter<any> = new EventEmitter();

  constructor() { }

  reset() {
    const cart = new Cart();
    this.setCart(cart);
  }

  getCart() {
    let cart = JSON.parse(localStorage.getItem(this.localStorageName));
    if ( cart ) {
      cart = new Cart(cart);
    } else {
      this.reset();
    }
    return cart;
  }

  setCart(cart) {
    localStorage.setItem(this.localStorageName, JSON.stringify(cart));
    this.cart.emit(cart);
  }

  addMembership(membership: Membership) {
    const cart = this.getCart();

    cart['memberships'].push(membership);

    this.setCart(cart);
  }

  removeMembership(membershipId: number) {
    const cart = this.getCart();

    let index = 0;
    for (const membership of cart.memberships) {
      if (membership.id === membershipId) {
        cart['memberships'].splice(index, 1);
        break;
      }
      index += 1;
    }

    this.setCart(cart);
  }

  addRetirement(retirement: Retirement) {
    const cart = this.getCart();

    cart['retirements'].push(retirement);

    this.setCart(cart);
  }

  removeRetirement(retirementId: number) {
    const cart = this.getCart();

    let index = 0;
    for (const retirement of cart.retirements) {
      if (retirement.id === retirementId) {
        cart['retirements'].splice(index, 1);
        break;
      }
      index += 1;
    }

    this.setCart(cart);
  }

  addPaymentToken(token, isNew = false) {
    const cart = this.getCart();

    if (isNew) {
      cart['single_use_token'] = token;
    } else {
      cart['payment_token'] = token;
    }
  }
}
