import BaseModel from './baseModel';
import {User} from './user';
import {Retirement} from './retirement';
import {OrderLine} from './orderLine';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

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
      return _('retirement-reservation-model.cancelation_reason.user_cancelation');
    }
    if (this.cancelation_reason === 'RD') {
      return _('retirement-reservation-model.cancelation_reason.retirement_deleted');
    }
    if (this.cancelation_reason === 'RM') {
      return _('retirement-reservation-model.cancelation_reason.retirement_updated');
    }
    return null;
  }

  getCancelationActionLabel() {
    if (this.cancelation_action === 'R') {
      return _('retirement-reservation-model.cancelation_action.refund');
    }
    if (this.cancelation_action === 'E') {
      return _('retirement-reservation-model.cancelation_action.exchange');
    }
    return null;
  }
}

