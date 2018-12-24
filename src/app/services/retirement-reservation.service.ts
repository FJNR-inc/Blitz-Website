import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {Retirement} from '../models/retirement';

@Injectable()
export class RetirementReservationService extends GlobalService {

  url_retirement_reservation = environment.url_base_api + environment.paths_api.retirementReservations;

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
        if (filter.name === 'user') {
          params = params.set('user', filter.value);
        } else if (filter.name === 'retirement') {
          params = params.set('retirement', filter.value);
        } else if (filter.name === 'is_active') {
          params = params.set('is_active', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_retirement_reservation,
      {headers: headers, params: params}
    );
  }
}
