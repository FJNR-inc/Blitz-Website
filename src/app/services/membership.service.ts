import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Membership } from '../models/membership';

@Injectable()
export class MembershipService extends GlobalService {

  url_memberships = environment.url_base_api + environment.paths_api.memberships;

  constructor(public http: HttpClient) {
    super();
  }

  create(membership: Membership): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_memberships,
      membership,
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
        if (filter.name === 'academic_levels') {
          if (filter.value === null) {
            params = params.set('academic_levels__isnull', 'true');
          } else {
            params = params.set('academic_levels', filter.value);
          }
        }
        if (filter.name === 'available') {
          params = params.set('available', filter.value);
        }
      }
    }

    return this.http.get<any>(
      this.url_memberships,
      {headers: headers, params: params}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_memberships + '/' + id,
      {headers: headers}
    );
  }

  update(url: string, membership: Membership): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      membership,
      {headers: headers}
    );
  }

  remove(membership: Membership): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      membership.url,
      {headers: headers}
    );
  }
}
