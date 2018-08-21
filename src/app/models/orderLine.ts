import BaseModel from './baseModel';

export class OrderLine extends BaseModel {
  id: number;
  url: string;
  content_type: string;
  object_id: number;
  order: string;
  quantity: number;
}

