import BaseModel from './baseModel';
import {DateUtil} from '../utils/date';

export class Coupon extends BaseModel {
  id: number;
  url: string;
  applicable_product_types: string;
  value: string;
  max_use: string;
  max_use_per_user: string;
  start_time: string;
  end_time: string;
  details: string;
  owner: string;
  applicable_retirements: string;
  applicable_timeslots: string;
  applicable_packages: string;
  applicable_memberships: string;

  constructor(data: Object = {}) {
    super(data);
  }

  getStartTime() {
    const date = new Date(this.start_time);
    return DateUtil.formatDay(date) + ' - ' + DateUtil.formatTime(date);
  }

  getEndTime() {
    const date = new Date(this.start_time);
    return DateUtil.formatDay(date) + ' - ' + DateUtil.formatTime(date);
  }
}

