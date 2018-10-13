import BaseModel from './baseModel';
import { DateUtil } from '../utils/date';
import {Workplace} from './workplace';

export class TimeSlot extends BaseModel {
  url: string;
  id: number;
  name: string;
  price: number;
  start_time: string;
  end_time: string;
  users: string[];
  places_remaining: number;
  workplace: Workplace;

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
}

