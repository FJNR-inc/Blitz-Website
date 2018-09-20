import BaseModel from './baseModel';

export class Card extends BaseModel {
  id: number;
  card_expiry: {
    year: number,
    month: number
  };
  card_type: string;
  last_digits: string;
  holder_name: string;
  payment_token: string;
}
