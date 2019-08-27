import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import GlobalService from './globalService';
import {environment} from '../../environments/environment';

@Injectable()
export class OrderLineService extends GlobalService {

  url_orderLines_export = environment.url_base_api + environment.paths_api.orderLines_export;
  url_orderLines_chartJS = environment.url_base_api + environment.paths_api.orderLines_chartJS;
  url_orderLines_product_list = environment.url_base_api + environment.paths_api.orderLines_product_list;

  constructor(public http: HttpClient) {
    super();
  }

  export(page: number = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', page.toString());
    return this.http.get<any>(
      this.url_orderLines_export,
      {
        headers: headers,
        params: params,
      });
  }

  chartjs(products: number[] = [],
          start: Date = null,
          end: Date = null,
          groupByObject: boolean = false,
          interval: string): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();

    params = params.append('interval', interval);
    params = params.append('aggregate', 'sum');

    if (groupByObject) {
      params = params.append('group_by_object', 'True');
    }

    products.forEach(product =>
      params = params.append('content_type', product.toString()));

    if (start) {
      params = params.append('start', start.toISOString());
    }

    if (end) {
      const end_param = new Date();
      end_param.setDate(end.getDate() + 1);
      params = params.append('end', end_param.toISOString());
    }

    return this.http.get<any>(
      this.url_orderLines_chartJS,
      {
        headers: headers,
        params: params,
      });
  }

  product_list(): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams();
    return this.http.get<any>(
      this.url_orderLines_product_list,
      {
        headers: headers,
        params: params,
      });
  }
}
