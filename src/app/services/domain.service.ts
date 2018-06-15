import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Domain } from '../models/domain';


@Injectable()
export class DomainService extends GlobalService {

  url_domains = environment.url_base_api + environment.paths_api.domains;

  constructor(public http: HttpClient) {
    super();
  }

  create(domain: Domain): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_domains,
      domain,
      {headers: headers}
    );
  }

  list(limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    return this.http.get<any>(
      this.url_domains,
      {headers: headers, params: params}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_domains + '/' + id,
      {headers: headers}
    );
  }

  update(url: string, domain: Domain): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      domain,
      {headers: headers}
    );
  }

  remove(domain: Domain): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      domain.url,
      {headers: headers}
    );
  }
}
