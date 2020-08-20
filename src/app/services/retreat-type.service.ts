import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {RetreatType} from '../models/retreatType';


@Injectable()
export class RetreatTypeService extends GlobalService {
  url_retreat_types = environment.url_base_api + environment.paths_api.retreat_types;

  constructor(public http: HttpClient) {
    super();
  }

  create(retreatType: RetreatType): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_retreat_types,
      retreatType,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_retreat_types + '/' + id,
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
        let name = '';
        if (filter.name === 'is_virtual') {
          name = 'is_virtual';
        }

        if (name) {
          params = params.set(name, filter.value);
        }
      }
    }

    return this.http.get<any>(
      this.url_retreat_types,
      {headers: headers, params: params}
    );
  }

  remove(retreatType: RetreatType): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      retreatType.url,
      {headers: headers}
    );
  }

  update(url: string, retreatType: RetreatType): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      retreatType,
      {headers: headers}
    );
  }
}
