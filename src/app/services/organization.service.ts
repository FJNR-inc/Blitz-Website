import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Organization } from '../models/organization';

@Injectable()
export class OrganizationService extends GlobalService {

  url_organizations = environment.url_base_api + environment.paths_api.organizations;

  constructor(public http: HttpClient) {
    super();
  }

  create(organization: Organization): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_organizations,
      organization,
      {headers: headers}
    );
  }

  list(limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    return this.http.get<any>(
      this.url_organizations,
      {headers: headers, params: params}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_organizations + '/' + id,
      {headers: headers}
    );
  }

  update(url: string, organization: Organization): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      organization,
      {headers: headers}
    );
  }

  remove(organization: Organization): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      organization.url,
      {headers: headers}
    );
  }
}
