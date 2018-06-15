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

  list(workplaceId: number = null, limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    if (workplaceId != null) {
      params = params.set('period__workplace', workplaceId.toString());
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
