import BaseModel from './baseModel';
import { User } from './user';
import { DateUtil } from '../utils/date';

export class TimeSlot extends BaseModel {
  url: string;
  id: number;
  name: string;
  price: number;
  start_time: string;
  end_time: string;
  users: string[];
  places_remaining: number;

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

