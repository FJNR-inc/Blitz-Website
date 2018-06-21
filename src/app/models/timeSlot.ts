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
    const date = new Date(this.start_time);
    return this.formatDay(date);
  }

  getStartTime() {
    const date = new Date(this.start_time);
    return this.formatTime(date);
  }

  getEndTime() {
    const date = new Date(this.end_time);
    return this.formatTime(date);
  }

  formatDay(date) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleDateString('fr-CA', options);
  }

  formatTime(date) {
    const options = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleString('fr-CA', options);
  }
}

