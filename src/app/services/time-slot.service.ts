import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { TimeSlot } from '../models/timeSlot';

@Injectable()
export class TimeSlotService extends GlobalService {

  url_time_slots = environment.url_base_api + environment.paths_api.time_slots;

  constructor(public http: HttpClient) {
    super();
  }

  create(timeslot: TimeSlot): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_time_slots,
      timeslot,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_time_slots + '/' + id,
      {headers: headers}
    );
  }

  list(filters: {name: string, value: any}[] = null, limit: number = 100, offset: number = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    if (filters != null) {
      for (const filter of filters) {
        if (filter.name === 'workplace') {
          params = params.set('period__workplace', filter.value);
        }
        if (filter.name === 'user') {
          params = params.set('users', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_time_slots,
      {headers: headers, params: params}
    );
  }

  update(url: string, timeslot: TimeSlot): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      timeslot,
      {headers: headers}
    );
  }

  remove(timeslot: TimeSlot): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      timeslot.url,
      {headers: headers}
    );
  }
}
