import BaseModel from './baseModel';
import { Workplace } from './workplace';
import { DateUtil } from '../utils/date';

export class Period extends BaseModel {
  id: number;
  url: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  workplace: Workplace[];
  price: number;

  getStartDay() {
    return DateUtil.formatDay(new Date(this.start_date));
  }

  getEndDay() {
    return DateUtil.formatDay(new Date(this.end_date));
  }
}
