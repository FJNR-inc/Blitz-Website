import BaseModel from './baseModel';
import { Workplace } from './workplace';

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
    return new Date(this.start_date).toLocaleDateString();
  }

  getEndDay() {
    return new Date(this.end_date).toLocaleDateString();
  }
}
