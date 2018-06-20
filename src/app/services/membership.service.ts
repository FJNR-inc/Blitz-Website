import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
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

  list(limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
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
