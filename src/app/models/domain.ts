import BaseModel from './baseModel';
import { Organization } from './organization';

export class Domain extends BaseModel {
  id: number;
  url: string;
  name: string;
  organization: Organization;
  example: string;
}

