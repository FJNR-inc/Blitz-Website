import BaseModel from './baseModel';
import {User} from './user';
import {Membership} from './membership';
import {DateUtil} from '../utils/date';

export class Retirement extends BaseModel {
  id: number;
  url: string;
  country: string;
  state_province: string;
  city: string;
  address_line1: string;
  address_line2: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  timezone: string;
  name: string;
  details: string;
  seats: number;
  activity_language: string;
  price: number;
  start_time: string;
  end_time: string;
  min_day_refund: number;
  refund_rate: number;
  min_day_exchange: number;
  users: User[];
  exclusive_memberships: Membership[];
  is_active: boolean;

  constructor(data: Object = {}) {
    super(data);
    if (data) {
      if (data.hasOwnProperty('exclusive_memberships')) {
        data['exclusive_memberships'].map(
          m => {
            this.exclusive_memberships.push(new Membership(m));
          }
        );
      }
    }
  }

  getDateInterval() {
    return DateUtil.getDateInterval(new Date(this.start_time), new Date(this.end_time));
  }
}

