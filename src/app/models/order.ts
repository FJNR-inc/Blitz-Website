import BaseModel from './baseModel';
import { OrderLine } from './orderLine';

export class Order extends BaseModel {
  id: number;
  order_lines: OrderLine[];
  url: string;
  user: string;
  transaction_date: string;
  authorization_id: number;
  settlement_id: number;
  single_use_token: number;
}

