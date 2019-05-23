import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Period } from '../models/period';
import {TimeSlot} from '../models/timeSlot';

@Injectable()
export class PeriodService extends GlobalService {

  url_periods = environment.url_base_api + environment.paths_api.periods;
  url_periods_export = environment.url_base_api + environment.paths_api.periods_export;

  constructor(public http: HttpClient) {
    super();
  }

  create(period: Period): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_periods,
      period,
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
        if (filter.name === 'workplace') {
          params = params.set('workplace', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_periods,
      {headers: headers, params: params}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_periods + '/' + id,
      {headers: headers}
    );
  }

  update(url: string, period: Period): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      period,
      {headers: headers}
    );
  }

  remove(period: Period, force = false, message = ''): Observable<any> {
    const headers = this.getHeaders();
    const body = {};
    if ( force ) {
      body['force_delete'] = force;
      body['custom_message'] = message;
    }
    return this.http.request<any>(
      'delete',
      period.url,
      {
        body: body,
        headers: headers
      }
    );
  }

  export(page: number = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', page.toString());
    return this.http.get<any>(
      this.url_periods_export,
      {
        headers: headers,
        params: params,
      });
  }
}
