import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {RetreatWaitingQueue} from '../models/retreatWaitingQueue';

@Injectable()
export class RetreatWaitingQueueService extends GlobalService {

  url_retreat_waiting_queues = environment.url_base_api + environment.paths_api.retreat_waiting_queues;

  constructor(public http: HttpClient) {
    super();
  }

  create(retreatWaitingQueue: RetreatWaitingQueue): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_retreat_waiting_queues,
      retreatWaitingQueue,
      {headers: headers}
    );
  }

  list(filters: {name: string, value: any}[] = null, limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    if (filters != null) {
      for (const filter of filters) {
        if (filter.name === 'user') {
          params = params.set('user', filter.value);
        }
        if (filter.name === 'retreat') {
          params = params.set('retreat', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_retreat_waiting_queues,
      {headers: headers, params: params}
    );
  }



  get(id: number): Observable<RetreatWaitingQueue> {
    const headers = this.getHeaders();
    return this.http.get<RetreatWaitingQueue>(
      this.url_retreat_waiting_queues + '/' + id,
      {headers: headers}
    );
  }

  delete(retreatWaitingQueue: RetreatWaitingQueue): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      retreatWaitingQueue.url,
      {headers: headers}
    );
  }
}
