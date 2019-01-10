import {Membership} from './membership';
import {Retirement} from './retirement';
import {TimeSlot} from './timeSlot';
import {TaxeUtil} from '../utils/taxe';
import {Order} from './order';
import {OrderLine} from './orderLine';
import {Coupon} from './coupon';

export class Cart {
  _memberships: Membership[] = [];
  _retirements: Retirement[] = [];
  _timeslots: TimeSlot[] = [];
  _coupons: Coupon[] = [];
  _single_use_token: string;
  _payment_token: string;

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
      if (data.hasOwnProperty('_retirements')) {
        data['_retirements'].map(
          r => {
            this._retirements.push(new Retirement(r));
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
    }
  }

  getRetirements() {
    return this._retirements;
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

  addRetirement(retirement: Retirement) {
    this._retirements.push(retirement);
  }

  addCoupon(coupon: Coupon) {
    this._coupons.push(coupon);
  }

  addMembership(membership: Membership) {
    this._memberships.push(membership);
  }

  removeRetirement(retirementId: number) {
    let index = 0;
    for (const retirement of this._retirements) {
      if (retirement.id === retirementId) {
        this._retirements.splice(index, 1);
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
    if (this._retirements.length) {
      return false;
    }
    if (this._timeslots.length) {
      return false;
    }
    return true;
  }

  getSubTotal() {
    let total = 0;
    for (const membership of this._memberships) {
      total += Number(membership.price);
    }
    for (const retirement of this._retirements) {
      total += Number(retirement.price);
    }
    return total;
  }

  getTPS() {
    return TaxeUtil.getTPS(this.getSubTotal());
  }

  getTVQ() {
    return TaxeUtil.getTVQ(this.getSubTotal());
  }

  getTotal() {
    const subTotal = this.getSubTotal();
    let total = subTotal;

    total += TaxeUtil.getTPS(subTotal);
    total += TaxeUtil.getTVQ(subTotal);

    return total;
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
    if (this._retirements) {
      for (const retirement of this._retirements) {
        newOrder['order_lines'].push(new OrderLine({
            'content_type': 'retirement',
            'object_id': retirement.id,
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
    console.error(this._coupons.length);
    console.error(this._coupons.length);

    if (this._coupons.length > 0) {
      console.error('add coupon to order');
      newOrder['coupon'] = this._coupons[0].code;
    }

    return newOrder;
  }
}
