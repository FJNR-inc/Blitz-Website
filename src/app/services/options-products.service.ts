import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {OptionProduct} from '../models/optionProduct';
import {Coupon} from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class OptionsProductsService extends GlobalService  {

  url_options_products = environment.url_base_api + environment.paths_api.options_products;

  constructor(public http: HttpClient) {
    super();
  }

  list(filters: {name: string, value: any}[] = null, limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());

    return this.http.get<any>(
      this.url_options_products,
      {headers: headers, params: params}
    );
  }

  remove(optionProduct: OptionProduct): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      optionProduct.url,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_options_products + '/' + id,
      {headers: headers}
    );
  }

  create(optionProduct: OptionProduct): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_options_products,
      optionProduct,
      {headers: headers}
    );
  }

  update(url: string, optionProduct: OptionProduct): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      optionProduct,
      {headers: headers}
    );
  }
}
