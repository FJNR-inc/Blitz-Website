import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';

@Injectable()
export class OrderLineService extends GlobalService {

  url_orderLines_export = environment.url_base_api + environment.paths_api.orderLines_export;

  constructor(public http: HttpClient) {
    super();
  }

  export(page: number = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', page.toString());
    return this.http.get<any>(
      this.url_orderLines_export,
      {
        headers: headers,
        params: params,
      });
  }
}
