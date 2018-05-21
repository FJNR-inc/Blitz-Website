import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Organization } from '../models/organization';

@Injectable()
export class OrganizationService extends GlobalService {

  url_organizations = environment.url_base_api + environment.paths_api.organizations;

  constructor(public http: HttpClient) {
    super();
  }

  create(name: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_organizations,
      {
        'name': name
      },
      {headers: headers}
    );
  }

  list(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_organizations,
      {headers: headers}
    );
  }

  update(url: string, name: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      {
        'name': name
      },
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
