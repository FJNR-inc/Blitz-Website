import BaseModel from './baseModel';
import { Membership } from './membership';
import {OptionProduct} from './optionProduct';

export class ReservationPackage extends BaseModel {
  url: string;
  id: number;
  name: string;
  name_fr: string;
  name_en: string;
  price: number;
  details: string;
  reservations: number;
  exclusive_memberships: Membership[];
  available: boolean;
  options: OptionProduct[];
}

