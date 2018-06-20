import BaseModel from './baseModel';
import { Membership } from './membership';

export class ReservationPackage extends BaseModel {
  url: string;
  id: number;
  name: string;
  price: number;
  details: string;
  reservations: number;
  memberships: Membership[];
}

