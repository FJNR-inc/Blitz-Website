import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';

@Injectable()
export class OrderService extends GlobalService {

  url_orders = environment.url_base_api + environment.paths_api.orders;

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
}
