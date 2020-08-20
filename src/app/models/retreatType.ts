import BaseModel from './baseModel';

export class RetreatType extends BaseModel {
  id: number;
  url: string;
  name: string;
  icon: string;
  minutes_before_display_link: number;
  number_of_tomatoes: number;
  short_description: string;
  description: string;
  duration_description: string;
  is_virtual: boolean;
  cancellation_policies: string;
  know_more_link: string;

  constructor(data: Object = {}) {
    super(data);
  }
}

