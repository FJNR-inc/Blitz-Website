import BaseModel from './baseModel';
import {Country} from "./country";
import {StateProvince} from "./stateProvince";

export class Location extends BaseModel {
  id: number;
  address_line1: string;
  address_line2: string;
  postal_code: string;
  city: string;
  country: Country;
  state_province: StateProvince;
}

