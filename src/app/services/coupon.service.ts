import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {Retirement} from '../models/retirement';
import {Coupon} from '../models/coupon';

@Injectable()
export class CouponService extends GlobalService {

  url_coupons = environment.url_base_api + environment.paths_api.coupons;

  constructor(public http: HttpClient) {
    super();
  }

  create(coupon: Coupon): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_coupons,
      coupon,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_coupons + '/' + id,
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
        if (filter.name === 'is_active') {
          params = params.set('is_active', filter.value);
        }
        if (filter.name === 'end_time__gte') {
          params = params.set('end_time__gte', filter.value);
        }
        if (filter.name === 'owner') {
          params = params.set('owner', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_coupons,
      {headers: headers, params: params}
    );
  }

  update(url: string, coupon: Coupon): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      coupon,
      {headers: headers}
    );
  }

  remove(coupon: Coupon): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      coupon.url,
      {headers: headers}
    );
  }

  notify(coupon: Coupon, emails: string[]): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      coupon.url + '/notify',
      {
        'email_list': emails
      },
      {headers: headers}
    );
  }
}
