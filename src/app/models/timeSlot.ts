import BaseModel from './baseModel';
import { User } from './user';

export class TimeSlot extends BaseModel {
  url: string;
  id: number;
  name: string;
  price: number;
  start_time: string;
  end_time: string;
  users: User[];

  getStartDay() {
    return new Date(this.start_time).toLocaleDateString();
  }

  getStartTime() {
    const date = new Date(this.start_time);
    return date.toLocaleTimeString();
  }

  getEndTime() {
    const date = new Date(this.end_time);
    return date.toLocaleTimeString();
  }
}

