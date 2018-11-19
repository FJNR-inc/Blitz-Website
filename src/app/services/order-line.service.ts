import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';

@Injectable()
export class OrderLineService extends GlobalService {

  url_orderLines_export = environment.url_base_api + environment.paths_api.orderLines_export;

  constructor(public http: HttpClient) {
    super();
  }

  export(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_orderLines_export,
      {
        headers: headers,
        responseType: 'blob' as 'json'
      });
  }
}
