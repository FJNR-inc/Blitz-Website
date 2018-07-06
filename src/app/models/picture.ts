import BaseModel from './baseModel';
import { Workplace } from './workplace';

export class Picture extends BaseModel {
  id: number;
  name: string;
  picture: string;
  workplace: Workplace;
}
