import BaseModel from './baseModel';
import {User} from './user';
import {Retirement} from './retirement';
import {OrderLine} from './orderLine';
import {TimeSlot} from './timeSlot';

export class RetirementReservation extends BaseModel {
  url: string;
  id: number;
  is_active: boolean;
  cancelation_reason: string;
  cancelation_action: string;
  cancelation_date: string;
  is_present: boolean;
  user: string;
  user_details: User;
  retirement: string;
  retirement_details: Retirement;
  order_line: OrderLine;

  constructor(data: Object = {}) {
    super(data);
    if (data.hasOwnProperty('user_details')) {
      this.user_details = new User(data['user_details']);
    }
    if (data.hasOwnProperty('retirement_details')) {
      this.retirement_details = new Retirement(data['retirement_details']);
    }
  }

  getCancelationReasonLabel() {
    if (this.cancelation_reason === 'U') {
      return 'User cancelation';
    }
    if (this.cancelation_reason === 'RD') {
      return 'Retirement have been deleted';
    }
    if (this.cancelation_reason === 'RM') {
      return 'Retirement have been modified';
    }
    return null;
  }

  getCancelationActionLabel() {
    if (this.cancelation_action === 'R') {
      return 'Refund';
    }
    if (this.cancelation_action === 'E') {
      return 'Exchange';
    }
    return null;
  }
}

