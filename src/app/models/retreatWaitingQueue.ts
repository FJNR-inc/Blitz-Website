import BaseModel from './baseModel';
import {User} from './user';
import {Membership} from './membership';
import {DateUtil} from '../utils/date';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

export class RetreatWaitingQueue extends BaseModel {
  id: number;
  url: string;
  user: string;
  retreat: string;

  constructor(data: Object = {}) {
    super(data);
  }
}

