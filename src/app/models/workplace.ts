import BaseModel from './baseModel';
import { Country } from './country';
import { StateProvince } from './stateProvince';

export class Workplace extends BaseModel {
  url: string;
  id: number;
  name: string;
  details: string;
  seats: string;
  address_line1: string;
  address_line2: string;
  postal_code: string;
  city: string;
  country: string;
  state_province: string;
  timezone: string;
  pictures: string[];

  getAddress() {
    let string = this.address_line1 + ', ';
    if(this.address_line2) {
      string += this.address_line2 + ', ';
    }
    string += this.city + ', ';
    string += this.state_province + ' ';
    string += this.postal_code + ', ';
    string += this.country;
    return string;
  }
}

