import BaseModel from './baseModel';

export class RetreatWaitingQueueNotification extends BaseModel {
  id: number;
  url: string;
  user: string;
  retirement: string;
  created_at: string;

  constructor(data: Object = {}) {
    super(data);
  }
}

