import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';


@Injectable()
export class OrganizationService extends GlobalService {

  url_organizations = environment.url_base_api + environment.paths_api.organizations;

  constructor(public http: HttpClient) {
    super();
  }

  list(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_organizations,
      {headers: headers}
    );
  }
}
