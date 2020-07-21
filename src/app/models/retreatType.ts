import BaseModel from './baseModel';

export class RetreatType extends BaseModel {
  id: number;
  url: string;
  name: string;
  name_fr: string;
  name_en: string;
  minutes_before_display_link: number;
  number_of_tomatoes: number;
}

