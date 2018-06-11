import BaseModel from './baseModel';
import { Location } from './location';

export class Workplace extends BaseModel {
  url: string;
  id: number;
  location: Location;
  name: string;
  details: string;
  seats: string;
}

