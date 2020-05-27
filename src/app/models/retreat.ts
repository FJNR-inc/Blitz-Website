import BaseModel from './baseModel';
import {User} from './user';
import {Membership} from './membership';
import {DateUtil} from '../utils/date';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {OptionProduct} from './optionProduct';
import {environment} from '../../environments/environment';

export enum ROOM_CHOICES {
  DOUBLE_OCCUPATION = 'double_occupation' ,
  SINGLE_OCCUPATION = 'single_occupation' ,
  DOUBLE_SINGLE_OCCUPATION = 'double_single_occupation' ,
}

export enum TYPE_CHOICES {
  VIRTUAL = 'V' ,
  PHYSICAL = 'P' ,
}

export class Retreat extends BaseModel {
  id: number;
  url: string;
  type: TYPE_CHOICES;
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

  constructor(data: Object = {}) {
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
    return DateUtil.getDateInterval(new Date(this.start_time), new Date(this.end_time));
  }

  getStartDate() {
    return new Date(this.start_time);
  }

  getEndDate() {
    return new Date(this.end_time);
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
    if (this.type === 'V') {
      return 'retreat.form.retreat.type.choices.virtual';
    } else {
      return 'retreat.form.retreat.type.choices.physical';
    }
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
    if (this.type === 'V') {
      return environment.tomato_per_virtual_retreat;
    } else {
      return environment.tomato_per_physical_retreat;
    }
  }

  get isOpen() {
    const minutesBeforeRetreat = environment.minutesBeforeShowVirtualRetreatLink;
    const visibleDate = new Date(new Date(this.start_time).getTime() + minutesBeforeRetreat * 60 * 1000);
    const linkIsVisible = new Date() > visibleDate;
    const isFinished = new Date() > new Date(this.end_time);
    return this.type === 'V' && this.videoconference_link && linkIsVisible && !isFinished;
  }
}

