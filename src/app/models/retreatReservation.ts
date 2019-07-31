import BaseModel from './baseModel';
import {User} from './user';
import {Retreat} from './retreat';
import {OrderLine} from './orderLine';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

export class RetreatReservation extends BaseModel {
  url: string;
  id: number;
  is_active: boolean;
  cancelation_reason: string;
  cancelation_action: string;
  cancelation_date: string;
  is_present: boolean;
  user: string;
  user_details: User;
  retreat: string;
  retreat_details: Retreat;
  order_line: OrderLine;
  exchangeable: boolean;
  refundable: boolean;
  inscription_date: string;

  constructor(data: Object = {}) {
    super(data);
    if (data.hasOwnProperty('user_details')) {
      this.user_details = new User(data['user_details']);
    }
    if (data.hasOwnProperty('retreat_details')) {
      this.retreat_details = new Retreat(data['retreat_details']);
    }
  }

  getCancelationReasonLabel() {
    if (this.cancelation_reason === 'U') {
      return _('retreat-reservation-model.cancelation_reason.user_cancelation');
    }
    if (this.cancelation_reason === 'RD') {
      return _('retreat-reservation-model.cancelation_reason.retreat_deleted');
    }
    if (this.cancelation_reason === 'RM') {
      return _('retreat-reservation-model.cancelation_reason.retreat_updated');
    }
    return null;
  }

  getCancelationActionLabel() {
    if (this.cancelation_action === 'R') {
      return _('retreat-reservation-model.cancelation_action.refund');
    }
    if (this.cancelation_action === 'E') {
      return _('retreat-reservation-model.cancelation_action.exchange');
    }
    return null;
  }
}

