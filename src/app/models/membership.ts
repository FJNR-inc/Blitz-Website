import BaseModel from './baseModel';
import { AcademicLevel } from './academicLevel';

export class Membership extends BaseModel {
  url: string;
  id: number;
  name: string;
  price: number;
  details: string;
  duration: number;
  academic_levels: number[];
  available: boolean;
}

