import BaseModel from './baseModel';

export class User extends BaseModel {
  id: number;
  url: string;
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
  membership: any;
  membership_end: string;
  tickets: number;

  getUniversity() {
    if (this.university) {
      return this.university.name;
    } else {
      return null;
    }
  }

  getTimeBeforeEndMembership() {
    const endMembership = new Date(this.membership_end);
    const now = Date.now();
    const delta = endMembership.getTime() - now;
    return Math.ceil(delta / 86400000);
  }

  getBirthdate() {
    /* Since the birthdate have no timezone
       in the API we add our timezone in
       the UTC date to reverse the display timezone
    */
    const date = new Date(this.birthdate);
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() + offset * 60000);
  }
}

