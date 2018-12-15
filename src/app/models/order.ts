import BaseModel from './baseModel';
import { OrderLine } from './orderLine';
import {TimeSlot} from './timeSlot';
import {User} from './user';

export class Order extends BaseModel {
  id: number;
  order_lines: OrderLine[];
  url: string;
  user: string;
  transaction_date: string;
  authorization_id: number;
  settlement_id: number;
  single_use_token: string;
  payment_token: string;

  constructor(data: Object = {}) {
    super(data);
    if (data) {
      if (data.hasOwnProperty('order_lines')) {
        data['order_lines'].map(
          o => {
            this.order_lines.push(new OrderLine(o));
          }
        );
      }
    }
  }
}

