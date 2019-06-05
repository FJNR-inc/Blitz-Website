import {Membership} from './membership';
import {Retreat} from './retreat';
import {TimeSlot} from './timeSlot';
import {TaxeUtil} from '../utils/taxe';
import {Order} from './order';
import {OrderLine} from './orderLine';
import {Coupon} from './coupon';
import {AppliedCoupon} from './appliedCoupon';
import {assertPlatform} from '@angular/core';

export class Cart {
  _memberships: Membership[] = [];
  _retreats: Retreat[] = [];
  _timeslots: TimeSlot[] = [];
  _coupons: Coupon[] = [];
  _single_use_token: string;
  _payment_token: string;
  _applied_coupons: AppliedCoupon[] = [];

  constructor(data: Object = {}) {
    if (data) {
      if (data.hasOwnProperty('_single_use_token')) {
        this._single_use_token = data['_single_use_token'];
      }
      if (data.hasOwnProperty('_payment_token')) {
        this._payment_token = data['_payment_token'];
      }
      if (data.hasOwnProperty('_memberships')) {
        data['_memberships'].map(
          m => {
            this._memberships.push(new Membership(m));
          }
        );
      }
      if (data.hasOwnProperty('_retreats')) {
        data['_retreats'].map(
          r => {
            this._retreats.push(new Retreat(r));
          }
        );
      }
      if (data.hasOwnProperty('_timeslots')) {
        data['_timeslots'].map(
          t => {
            this._timeslots.push(new TimeSlot(t));
          }
        );
      }
      if (data.hasOwnProperty('_coupons')) {
        data['_coupons'].map(
          t => {
            this._coupons.push(new Coupon(t));
          }
        );
      }
      if (data.hasOwnProperty('_applied_coupons')) {
        data['_applied_coupons'].map(
          t => {
            this._applied_coupons.push(new AppliedCoupon(t));
          }
        );
      }
    }
  }

  getRetreats() {
    return this._retreats;
  }

  getTimeslots() {
    return this._timeslots;
  }

  getMemberships() {
    return this._memberships;
  }

  getCoupons() {
    return this._coupons;
  }

  getAppliedCoupons() {
    return this._applied_coupons;
  }

  setSingleUseToken(token: string) {
    this._single_use_token = token;
    this._payment_token = null;
  }

  setPaymentToken(token: string) {
    this._single_use_token = null;
    this._payment_token = token;
  }

  removePaymentToken() {
    this._single_use_token = null;
    this._payment_token = null;
  }

  addRetreat(retreat: Retreat) {
    this._retreats.push(retreat);
  }

  addCoupon(coupon: Coupon) {
    if (coupon.code) {
      this._coupons.push(coupon);
    } else {
      console.error('Coupon may have a code.');
    }
  }

  setAppliedCoupon(coupon: AppliedCoupon[]) {
    this._applied_coupons = coupon;
  }

  addMembership(membership: Membership) {
    this._memberships.push(membership);
  }

  removeRetreat(retreatId: number) {
    let index = 0;
    for (const retreat of this._retreats) {
      if (retreat.id === retreatId) {
        this._retreats.splice(index, 1);
        break;
      }
      index += 1;
    }
  }

  removeMembership(membershipId: number) {
    let index = 0;
    for (const membership of this._memberships) {
      if (membership.id === membershipId) {
        this._memberships.splice(index, 1);
        break;
      }
      index += 1;
    }
  }

  removeCoupon(couponCode: string) {
    let index = 0;
    for (const coupon of this._coupons) {
      if (coupon.code === couponCode) {
        this._coupons.splice(index, 1);
        break;
      }
      index += 1;
    }
  }

  containPaymentMethod() {
    if (this._single_use_token) {
      return true;
    } else if (this._payment_token) {
      return true;
    } else {
      return false;
    }
  }

  isEmpty() {
    if (this._memberships.length) {
      return false;
    }
    if (this._retreats.length) {
      return false;
    }
    if (this._timeslots.length) {
      return false;
    }
    return true;
  }

  getSubTotal(): string {
    let total = 0;
    for (const membership of this._memberships) {
      total += Number(membership.price);
    }
    for (const retreat of this._retreats) {
      total += Number(retreat.price);
    }
    for (const appliedCoupon of this._applied_coupons) {
      total -= Number(appliedCoupon.value);
    }
    return total.toFixed(2);
  }

  getTPS() {
    return TaxeUtil.getTPS(parseFloat(this.getSubTotal()));
  }

  getTVQ() {
    return TaxeUtil.getTVQ(parseFloat(this.getSubTotal()));
  }

  getTotal() {
    const subTotal = parseFloat(this.getSubTotal());
    let total = subTotal;

    total += TaxeUtil.getTPS(subTotal);
    total += TaxeUtil.getTVQ(subTotal);

    return total.toFixed(2);
  }

  generateOrder(): Order {
    const newOrder = new Order(
      {
        'order_lines': [],
      }
    );
    if (this._single_use_token) {
      newOrder['single_use_token'] = this._single_use_token;
    } else if (this._payment_token) {
      newOrder['payment_token'] = this._payment_token;
    }
    if (this._memberships) {
      for (const membership of this._memberships) {
        newOrder['order_lines'].push(new OrderLine({
            'content_type': 'membership',
            'object_id': membership.id,
            'quantity': 1,
          })
        );
      }
    }
    if (this._retreats) {
      for (const retreat of this._retreats) {
        newOrder['order_lines'].push(new OrderLine({
            'content_type': 'retreat',
            'object_id': retreat.id,
            'quantity': 1,
          })
        );
      }
    }
    if (this._timeslots) {
      for (const timeslot of this._timeslots) {
        newOrder['order_lines'].push(new OrderLine({
            'content_type': 'timeslot',
            'object_id': timeslot.id,
            'quantity': 1,
          })
        );
      }
    }

    if (this._coupons.length > 0) {
      newOrder['coupon'] = this._coupons[0].code;
    }

    return newOrder;
  }
}
