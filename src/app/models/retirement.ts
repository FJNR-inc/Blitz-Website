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
  country_en: string;
  state_province_en: string;
  city_en: string;
  country_fr: string;
  state_province_fr: string;
  city_fr: string;
  address_line1: string;
  address_line2: string;
  address_line1_en: string;
  address_line2_en: string;
  address_line1_fr: string;
  address_line2_fr: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  timezone: string;
  name: string;
  name_fr: string;
  name_en: string;
  details: string;
  details_en: string;
  details_fr: string;
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

  getAddress() {
    let string = this.address_line1 + ', ';
    if (this.address_line2) {
      string += this.address_line2 + ', ';
    }
    string += this.city + ', ';
    string += this.state_province + ' ';
    string += this.postal_code + ', ';
    string += this.country;
    return string;
  }

  getDateInterval() {
    return DateUtil.getDateInterval(new Date(this.start_time), new Date(this.end_time));
  }
}

