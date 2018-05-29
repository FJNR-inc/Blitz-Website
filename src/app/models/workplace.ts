import BaseModel from './baseModel';

export class Workplace extends BaseModel {
  url: string;
  location: Location;
  name: string;
  details: string;
  seats: string;
}

