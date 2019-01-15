import BaseModel from './baseModel';
import {DateUtil} from '../utils/date';
import {OrderLine} from './orderLine';
import {Coupon} from './coupon';

export class AppliedCoupon extends BaseModel {
  coupon: Coupon;
  value: string;
  orderline: OrderLine;
  reason: string;
}

