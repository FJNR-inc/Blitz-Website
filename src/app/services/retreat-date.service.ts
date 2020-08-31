import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {RetreatDate} from '../models/retreatDate';


@Injectable()
export class RetreatDateService extends GlobalService {
  url_retreat_dates = environment.url_base_api + environment.paths_api.retreat_dates;

  constructor(public http: HttpClient) {
    super();
  }

  create(retreatDate: RetreatDate): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_retreat_dates,
      retreatDate,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_retreat_dates + '/' + id,
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
        if (filter.name === 'retreat') {
          params = params.set('retreat', filter.value);
        }
      }
    }

    return this.http.get<any>(
      this.url_retreat_dates,
      {headers: headers, params: params}
    );
  }

  remove(retreatDate: RetreatDate): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      retreatDate.url,
      {headers: headers}
    );
  }

  update(url: string, retreatDate: RetreatDate): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      retreatDate,
      {headers: headers}
    );
  }
}
