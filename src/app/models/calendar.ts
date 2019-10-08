import BaseModel from './baseModel';
import {User} from './user';
import {DateUtil} from '../utils/date';

export enum ColorCode {
  manyPlace = '#708867',
  less50Place = '#FFB415',
  almostNoPlace = '#D95219',
  noPlace = '#E5DBCE',
}

export enum PeriodOfDay {
  am = 'am',
  pm = 'pm',
  night = 'night',
}

export class CalendarDay extends BaseModel {

  date: Date;
  position_of_week: number;
  periods: CalendarPeriod[] = [];

  getMonthStr() {
    return DateUtil.getShortMonth(this.date);
  }

  getDayStr() {
    return DateUtil.getShortDay(this.date);
  }
}

export class CalendarPeriod extends BaseModel {
  id: string | number;
  start: Date;
  end: Date;
  places_remaining: number;
  places: number;
  get period_day(): PeriodOfDay{
    const hours = this.start.getHours();
    if (hours >= 0 && hours < 12) {
      return PeriodOfDay.am;
    } else if (hours >= 12 && hours < 18) {
      return PeriodOfDay.pm;
    } else if (hours >= 18 && hours <= 23) {
      return PeriodOfDay.night;
    }
  }

  get css_style(): string{
    if (this.places_remaining <= 0) {
      return ColorCode.noPlace;
    } else if (this.places_remaining <= Number(this.places) / 4) {
      return ColorCode.almostNoPlace;
    } else if (this.places_remaining <= Number(this.places) / 2) {
      return ColorCode.less50Place;
    } else {
      return ColorCode.manyPlace;
    }
  }

  reservations: string[];
  users: string[];
}
