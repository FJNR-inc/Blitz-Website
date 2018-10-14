import BaseModel from './baseModel';
import { User } from './user';
import {TimeSlot} from './timeSlot';

export class Reservation extends BaseModel {
  url: string;
  id: number;
  timeslot: string;
  timeslot_details: TimeSlot;
  user: string;
  user_details: User;
  is_active: boolean;

  constructor(data: Object = {}) {
    super(data);
    if (data.hasOwnProperty('timeslot_details')) {
      this.timeslot_details = new TimeSlot(data['timeslot_details']);
    }
    if (data.hasOwnProperty('user_details')) {
      this.user_details = new User(data['user_details']);
    }
  }
}

