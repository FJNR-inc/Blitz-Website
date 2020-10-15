import BaseModel from './baseModel';
import { DateUtil } from '../utils/date';
import {Workplace} from './workplace';
import {OptionProduct} from './optionProduct';

export class TimeSlot extends BaseModel {
  url: string;
  id: number;
  name: string;
  price: number;
  billing_price: number;
  start_time: string;
  end_time: string;
  users: string[];
  places_remaining: number;
  workplace: Workplace;
  nb_reservations_active: number;

  getEndDate() {
    return new Date(this.end_time);
  }

  getStartDay() {
    const date = new Date(this.start_time);
    return DateUtil.formatDay(date);
  }

  getStartTime() {
    const date = new Date(this.start_time);
    return DateUtil.formatTime(date);
  }

  getEndTime() {
    const date = new Date(this.end_time);
    return DateUtil.formatTime(date);
  }

  getStartDate() {
    return DateUtil.getDate(new Date(this.start_time));
  }

  getStartDayName() {
    return DateUtil.getLongDay(new Date(this.start_time));
  }

  getStartMonthName() {
    return DateUtil.getLongMonth(new Date(this.start_time));
  }

  getStartYear() {
    return DateUtil.getYear(new Date(this.start_time));
  }
}

