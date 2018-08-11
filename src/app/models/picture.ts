import BaseModel from './baseModel';
import { Workplace } from './workplace';

export class Picture extends BaseModel {
  id: number;
  url: string;
  name: string;
  picture: string;
  workplace: string;
}
