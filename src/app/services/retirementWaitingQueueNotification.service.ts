import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {RetirementWaitingQueueNotification} from '../models/retirementWaitingQueueNotification';

@Injectable()
export class RetirementWaitingQueueNotificationService extends GlobalService {

  url_retirement_waiting_queue_notifications = environment.url_base_api + environment.paths_api.retirement_waiting_queue_notifications;

  constructor(public http: HttpClient) {
    super();
  }

  list(filters: {name: string, value: any}[] = null, limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    if (filters != null) {
      for (const filter of filters) {
        if (filter.name === 'retirement') {
          params = params.set('retirement', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_retirement_waiting_queue_notifications,
      {headers: headers, params: params}
    );
  }
}
