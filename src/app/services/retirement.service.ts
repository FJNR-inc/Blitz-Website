import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';

@Injectable()
export class RetirementService extends GlobalService {

  url_retirements = environment.url_base_api + environment.paths_api.retirements;

  constructor(public http: HttpClient) {
    super();
  }

  list(filters: {name: string, value: any}[] = null, limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());

    return this.http.get<any>(
      this.url_retirements,
      {headers: headers, params: params}
    );
  }
}
