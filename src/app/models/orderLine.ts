import BaseModel from './baseModel';

export interface OrderLineOption {
  id: number;
  quantity: number;
}
export class OrderLine extends BaseModel {
  id: number;
  url: string;
  content_type: string;
  object_id: number;
  order: string;
  quantity: number;
  options: OrderLineOption[];
  metadata: any;

  constructor(data: Object = {}) {
    super(data);
    if (data) {
      if (data.hasOwnProperty('options')) {
        this.options = data['options'];
      }
    }
  }
}

