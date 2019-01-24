import BaseModel from './baseModel';

export class RetirementWaitingQueueNotification extends BaseModel {
  id: number;
  url: string;
  user: string;
  retirement: string;
  created_at: string;

  constructor(data: Object = {}) {
    super(data);
  }
}

