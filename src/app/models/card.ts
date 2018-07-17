import BaseModel from './baseModel';

export class Card extends BaseModel {
  id: number;
  url: string;
  expiry_date: string;
  external_api_id: string;
  name: string;
  number: number;
  owner: string;
}
