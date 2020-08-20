import BaseModel from './baseModel';
import {DateUtil} from '../utils/date';
import {Retreat} from './retreat';

export class RetreatDate extends BaseModel {
  id: number;
  url: string;
  start_time: string;
  end_time: string;
  retreat: string;

  constructor(data: Object = {}) {
    super(data);
  }

  getStartTime() {
    const date = new Date(this.start_time);
    return DateUtil.formatDayAndTime(date);
  }

  getEndTime() {
    const date = new Date(this.end_time);
    return DateUtil.formatDayAndTime(date);
  }

  getDateInterval() {
    return DateUtil.getDateInterval(new Date(this.start_time), new Date(this.end_time));
  }
}

