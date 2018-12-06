import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';

@Injectable()
export class CustomPaymentsService extends GlobalService {

  url_custom_payments = environment.url_base_api + environment.paths_api.custom_payments;

  constructor(public http: HttpClient) {
    super();
  }

  create(order: Order): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_custom_payments,
      order,
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
      }
    }
    return this.http.get<any>(
      this.url_custom_payments,
      {headers: headers, params: params}
    );
  }
}
