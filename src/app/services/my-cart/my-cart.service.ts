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
    return cart;
  }

  getCart() {
    const cart = JSON.parse(localStorage.getItem(this.localStorageName));
    if ( cart !== undefined ) {
      return new Cart(cart);
    } else {
      return this.reset();
    }
  }

  contain(product: Retirement|TimeSlot|Membership) {
    const cart = this.getCart();

    for (const retirement of cart.getRetirements()) {
      if (retirement.url === product.url) {
        return true;
      }
    }

    for (const timeslot of cart.getTimeslots()) {
      if (timeslot.url === product.url) {
        return true;
      }
    }

    for (const membership of cart.getMemberships()) {
      if (membership.url === product.url) {
        return true;
      }
    }

    return false;
  }

  containMembership() {
    const cart = this.getCart();
    if (cart.getMemberships().length) {
      return true;
    } else {
      return false;
    }
  }

  setCart(cart: Cart) {
    localStorage.setItem(this.localStorageName, JSON.stringify(cart));
    this.cart.emit(cart);
  }

  addMembership(membership: Membership) {
    const cart = this.getCart();
    cart.addMembership(membership);
    this.setCart(cart);
  }

  removeMembership(membershipId: number) {
    const cart = this.getCart();
    cart.removeMembership(membershipId);
    this.setCart(cart);
  }

  addRetirement(retirement: Retirement) {
    const cart = this.getCart();
    cart.addRetirement(retirement);
    this.setCart(cart);
  }

  removeRetirement(retirementId: number) {
    const cart = this.getCart();
    cart.removeRetirement(retirementId);
    this.setCart(cart);
  }

  addPaymentToken(token, isNew = false) {
    const cart = this.getCart();
    if (isNew) {
      cart.setSingleUseToken(token);
    } else {
      cart.setPaymentToken(token);
    }
    this.setCart(cart);
  }

  removePaymentToken() {
    const cart = this.getCart();
    cart.removePaymentToken();
    this.setCart(cart);
  }

  containPaymentMethod() {
    const cart = this.getCart();
    return cart.containPaymentMethod();
  }
}
