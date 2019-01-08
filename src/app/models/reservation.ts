import BaseModel from './baseModel';
import { User } from './user';
import {TimeSlot} from './timeSlot';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

export class Reservation extends BaseModel {
  url: string;
  id: number;
  timeslot: string;
  timeslot_details: TimeSlot;
  user: string;
  user_details: User;
  is_active: boolean;
  is_present: boolean;
  cancelation_reason: string;

  constructor(data: Object = {}) {
    super(data);
    if (data.hasOwnProperty('timeslot_details')) {
      this.timeslot_details = new TimeSlot(data['timeslot_details']);
    }
    if (data.hasOwnProperty('user_details')) {
      this.user_details = new User(data['user_details']);
    }
  }

  getCancelationReasonLabel() {
    if (this.cancelation_reason === 'TM') {
      return _('reservation-model.cancelation_reason.bloc_modified');
    } else if (this.cancelation_reason === 'U') {
      return _('reservation-model.cancelation_reason.canceled_by_user');
    } else {
      return _('reservation-model.cancelation_reason.none');
    }
  }
}

