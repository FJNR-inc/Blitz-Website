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
}

