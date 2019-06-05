import BaseModel from './baseModel';
import {DateUtil} from '../utils/date';

export class Coupon extends BaseModel {
  id: number;
  url: string;
  code: string;
  applicable_product_types: string;
  value: string;
  percent_off: string;
  max_use: string;
  max_use_per_user: string;
  start_time: string;
  end_time: string;
  details: string;
  owner: string;
  applicable_retreats: string;
  applicable_timeslots: string;
  applicable_packages: string;
  applicable_memberships: string;

  getStartTime() {
    const date = new Date(this.start_time);
    return DateUtil.formatDay(date) + ' - ' + DateUtil.formatTime(date);
  }

  getEndTime() {
    const date = new Date(this.start_time);
    return DateUtil.formatDay(date) + ' - ' + DateUtil.formatTime(date);
  }

  getValue() {
    return this[this.getTypeOfValue()];
  }

  getTypeOfValue() {
    if (this.value && Number(this.value) > 0) {
      return 'value';
    } else {
      return 'percent_off';
    }
  }

  getLabelledTypeOfValue() {
    const type = this.getTypeOfValue();
    if (type === 'value') {
      return '$';
    } else if (type === 'percent_off') {
      return '%';
    } else {
      return '';
    }
  }
}

