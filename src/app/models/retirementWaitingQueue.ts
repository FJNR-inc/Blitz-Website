import BaseModel from './baseModel';
import {User} from './user';
import {Membership} from './membership';
import {DateUtil} from '../utils/date';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

export class RetirementWaitingQueue extends BaseModel {
  id: number;
  url: string;
  user: string;
  retirement: string;

  constructor(data: Object = {}) {
    super(data);
  }
}

