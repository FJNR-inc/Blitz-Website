import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
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

  list(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_domains,
      {headers: headers}
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
