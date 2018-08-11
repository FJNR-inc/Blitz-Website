import BaseModel from './baseModel';
import { Domain } from './domain';

export class Organization extends BaseModel {
  url: string;
  name: string;
  domains: Domain[];
}

