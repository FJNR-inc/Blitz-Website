import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {Retirement} from '../models/retirement';

@Injectable()
export class RetirementService extends GlobalService {

  url_retirements = environment.url_base_api + environment.paths_api.retirements;

  constructor(public http: HttpClient) {
    super();
  }

  create(retirement: Retirement): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_retirements,
      retirement,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_retirements + '/' + id,
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
        if (filter.name === 'name') {
          params = params.set('name', filter.value);
        }
        if (filter.name === 'end_time__gte') {
          params = params.set('end_time__gte', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_retirements,
      {headers: headers, params: params}
    );
  }

  update(url: string, retirement: Retirement): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      retirement,
      {headers: headers}
    );
  }

  remove(retirement: Retirement): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      retirement.url,
      {headers: headers}
    );
  }
}
