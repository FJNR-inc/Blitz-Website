import BaseModel from './baseModel';
import { Organization } from './organization';
import { AcademicField } from './academicField';
import { AcademicLevel } from './academicLevel';

export class User extends BaseModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  other_phone: string;
  university: any;
  academic_field: any;
  academic_level: any;
  birthdate: string;
  gender: string;
  is_active: boolean;
  is_superuser: boolean;
}

