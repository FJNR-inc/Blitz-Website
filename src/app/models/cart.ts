import {Membership} from './membership';
import {Retirement} from './retirement';
import {TimeSlot} from './timeSlot';
import {TaxeUtil} from '../utils/taxe';

export class Cart {
  _memberships: Membership[] = [];
  _retirements: Retirement[] = [];
  _timeslots: TimeSlot[] = [];
  _coupons: string[] = [];
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

  containPaymentMethod() {
    console.log(this);
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
}
