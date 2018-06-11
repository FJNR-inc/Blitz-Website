import BaseModel from './baseModel';
import { Organization } from './organization';

export class Domain extends BaseModel {
  id: number;
  name: string;
  organization: Organization;
  example: string;
}

