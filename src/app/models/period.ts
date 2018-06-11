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
}

