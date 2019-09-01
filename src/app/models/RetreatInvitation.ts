import BaseModel from './baseModel';
import {Coupon} from './coupon';
import {Retreat} from './retreat';

export class RetreatInvitation extends BaseModel {
  id: number;
  url: string;
  name?: string;
  nb_places: number;
  nb_places_used: number;
  coupon?: Coupon | string;
  retreat: Retreat | string;
  front_url: string;
}
