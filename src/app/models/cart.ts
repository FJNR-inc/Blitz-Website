import {Membership} from './membership';
import {Retirement} from './retirement';
import {TimeSlot} from './timeSlot';
import {TaxeUtil} from '../utils/taxe';

export class Cart {
  memberships: Membership[] = [];
  retirements: Retirement[] = [];
  timeslots: TimeSlot[] = [];
  single_use_token: string;
  payment_token: string;

  constructor(data: Object = {}) {

    if (data) {
      if (data.hasOwnProperty('memberships')) {
        data['memberships'].map(
          m => {
            this.memberships.push(new Membership(m));
          }
        );
      }
      if (data.hasOwnProperty('retirements')) {
        data['retirements'].map(
          r => {
            this.retirements.push(new Retirement(r));
          }
        );
      }
      if (data.hasOwnProperty('timeslots')) {
        data['timeslots'].map(
          t => {
            this.timeslots.push(new TimeSlot(t));
          }
        );
      }
    }
  }

  isEmpty() {
    if (this.memberships.length) {
      return false;
    }
    if (this.retirements.length) {
      return false;
    }
    if (this.timeslots.length) {
      return false;
    }
    return true;
  }

  getSubTotal() {
    let total = 0;
    for (const membership of this.memberships) {
      total += Number(membership.price);
    }
    for (const retirement of this.retirements) {
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
