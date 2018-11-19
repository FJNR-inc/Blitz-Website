import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';

@Injectable()
export class OrderService extends GlobalService {

  url_orders = environment.url_base_api + environment.paths_api.orders;
  url_orders_export = environment.url_base_api + environment.paths_api.orders_export;

  constructor(public http: HttpClient) {
    super();
  }

  create(order: Order): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_orders,
      order,
      {headers: headers}
    );
  }

  export(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_orders_export,
      {
        headers: headers,
        responseType: 'blob' as 'json'
      });
  }
}
