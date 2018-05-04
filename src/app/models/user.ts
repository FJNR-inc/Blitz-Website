import BaseModel from './baseModel';
import { Organization } from './organization';

export class User extends BaseModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  other_phone: string;
  university: Organization;
  academic_field: string;
  academic_level: string;
  birthday: string;
  gender: string;
  is_active: boolean;
  is_superuser: boolean;
}

