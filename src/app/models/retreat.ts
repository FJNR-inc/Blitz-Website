import BaseModel from './baseModel';
import {User} from './user';
import {Membership} from './membership';
import {DateUtil} from '../utils/date';
import {OptionProduct} from './optionProduct';
import {environment} from '../../environments/environment';
import {RetreatType} from './retreatType';
import {RetreatDate} from './retreatDate';
import * as moment from 'moment';
import { Moment } from 'moment';

export enum ROOM_CHOICES {
  DOUBLE_OCCUPATION = 'double_occupation' ,
  SINGLE_OCCUPATION = 'single_occupation' ,
  DOUBLE_SINGLE_OCCUPATION = 'double_single_occupation' ,
}

export class Retreat extends BaseModel {
  id: number;
  url: string;
  animator: string;
  type: RetreatType;
  country: string;
  place_name: string;
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
  display_start_time: string;
  min_day_refund: number;
  refund_rate: number;
  min_day_exchange: number;
  users: User[];
  exclusive_memberships: Membership[];
  is_active: boolean;
  form_url: string;
  carpool_url: string;
  review_url: string;
  email_content: string;
  accessibility: boolean;
  reserved_seats: number;
  places_remaining: number;
  has_shared_rooms: boolean;
  hidden: boolean;
  options: OptionProduct[];
  google_maps_url: string;
  accessibility_detail: string;
  sub_title: string;
  description: string;
  food_vege: string;
  food_vegan: string;
  food_allergen_free: string;
  food_gluten_free: string;
  pictures: string[];
  room_type: ROOM_CHOICES;
  toilet_gendered: boolean;
  videoconference_tool: string;
  videoconference_link: string;
  dates: RetreatDate[];
  hide_from_client_admin_panel: boolean;

  constructor(data: Object = {}) {
    if (data) {
      if (data.hasOwnProperty('dates')) {
        const newValue = [];
        data['dates'].map(
          r => {
            newValue.push(new RetreatDate(r));
          }
        );
        data['dates'] = newValue;
      }
    }
    super(data);
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
    if (this.start_time && this.end_time) {
      return DateUtil.getDateInterval(new Date(this.start_time), new Date(this.end_time));
    } else {
      return 'Aucune date pour le moment';
    }
  }

  getStartDate() {
    return new Date(this.start_time);
  }

  getEndDate() {
    return new Date(this.end_time);
  }

  getDisplayStartDate() {
    if (this.display_start_time) {
      return new Date(this.display_start_time);
    } else {
      return null;
    }
  }

  getStartDay() {
    const date = new Date(this.start_time);
    return DateUtil.formatDay(date, false);
  }

  getStartTime() {
    const date = new Date(this.start_time);
    return DateUtil.formatDayAndTime(date);
  }

  getEndTime() {
    const date = new Date(this.end_time);
    return DateUtil.formatDayAndTime(date);
  }

  get type_name() {
    return this.type.name;
  }

  get activityLanguageLabel() {
    if (this.activity_language === 'B') {
      return 'retreat.form.retreat.activity_language.choices.bilingual';
    } else if (this.activity_language === 'FR') {
      return 'retreat.form.retreat.activity_language.choices.french';
    } else if (this.activity_language === 'EN') {
      return 'retreat.form.retreat.activity_language.choices.english';
    } else {
      return null;
    }
  }

  get firstPicture(){
    if (this.pictures.length > 0) {
      return this.pictures[0];
    } else {
      return '../../assets/images/retraite.jpg';
    }
  }

  get numberOfTomatoes() {
    return this.type.number_of_tomatoes;
  }

  get isOpen() {
    const minutesBeforeRetreat = environment.minutesBeforeShowVirtualRetreatLink;
    const visibleDate = new Date(new Date(this.start_time).getTime() - minutesBeforeRetreat * 60 * 1000);
    const linkIsVisible = new Date() > visibleDate;
    const isFinished = new Date() > new Date(this.end_time);
    return this.type.is_virtual && this.videoconference_link && linkIsVisible && !isFinished;
  }

  get addressIsFilled() {
    const fields = [
      'country',
      'place_name',
      'state_province',
      'city',
      'address_line1',
      'address_line2',
      'postal_code',
    ];

    for (const field of fields) {
      if (!(this.hasOwnProperty(field) && this[field])) {
          return false;
      }
    }

    return true;
  }

  get isSameDay() {
    return moment(this.start_time).isSame(moment(this.end_time), 'day');
  }
}

