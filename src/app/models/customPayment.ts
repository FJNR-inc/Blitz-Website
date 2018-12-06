import BaseModel from './baseModel';

export class CustomPayment extends BaseModel {
  id: number;
  name: string;
  price: string;
  details: string;
  user: string;
}

