import {EventEmitter, Injectable, Output} from '@angular/core';
import {Order} from '../../models/order';
import {OrderLine} from '../../models/orderLine';
import {Membership} from '../../models/membership';
import {Retreat} from '../../models/retreat';
import {TimeSlot} from '../../models/timeSlot';
import {Cart, SelectedProductOption} from '../../models/cart';
import {Coupon} from '../../models/coupon';
import {AppliedCoupon} from '../../models/appliedCoupon';
import {Time} from '@angular/common';
import {ReservationPackage} from '../../models/reservationPackage';

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

  contain(product: Retreat|TimeSlot|Membership) {
    const cart = this.getCart();
    return cart.contain(product);
  }

  containMembership() {
    const cart = this.getCart();
    if (cart.getMemberships().length) {
      return true;
    } else {
      return false;
    }
  }

  getCoupons() {
    return this.getCart().getCoupons();
  }

  generateOrder() {
    return this.getCart().generateOrder();
  }

  setAppliedCoupon(appliedCoupon: AppliedCoupon) {
    this.getCart().setAppliedCoupon(appliedCoupon);
  }

  getDifferenceOfTicket() {
    return this.getCart().getDifferenceOfTicket();
  }

  setCart(cart: Cart) {
    localStorage.setItem(this.localStorageName, JSON.stringify(cart));
    this.cart.emit(cart);
  }

  setMetadata(product: Retreat | TimeSlot | ReservationPackage | Membership, metadata) {
    const cart = this.getCart();
    cart.setMetadata(product, metadata);
    this.setCart(cart);
  }

  addMembership(membership: Membership) {
    const cart = this.getCart();
    cart.addMembership(membership);
    this.setCart(cart);
  }

  addCoupon(coupon: Coupon) {
    const cart = this.getCart();
    cart.addCoupon(coupon);
    this.setCart(cart);
  }

  removeMembership(membershipId: number) {
    const cart = this.getCart();
    cart.removeMembership(membershipId);
    this.setCart(cart);
  }

  removeReservationPackage(reservationPackageId: number) {
    const cart = this.getCart();
    cart.removeReservationPackage(reservationPackageId);
    this.setCart(cart);
  }

  removeCoupon(couponCode: string) {
    const cart = this.getCart();
    cart.removeCoupon(couponCode);
    this.setCart(cart);
  }

  addRetreat(retreat: Retreat, productOptions: SelectedProductOption[] = []) {
    const cart = this.getCart();
    cart.addRetreat(retreat, productOptions);
    this.setCart(cart);
  }

  removeRetreat(retreatId: number) {
    const cart = this.getCart();
    cart.removeRetreat(retreatId);
    this.setCart(cart);
  }

  addTimeslot(timeslot: TimeSlot, productOptions: SelectedProductOption[] = []) {
    const cart = this.getCart();
    cart.addTimeslot(timeslot, productOptions);
    this.setCart(cart);
  }

  addReservationPackage(reservationPackage: ReservationPackage) {
    const cart = this.getCart();
    cart.addReservationPackage(reservationPackage);
    this.setCart(cart);
  }

  removeTimeslot(timeslotId: number) {
    const cart = this.getCart();
    cart.removeTimeslot(timeslotId);
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
