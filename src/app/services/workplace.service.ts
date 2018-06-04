import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Workplace } from '../models/workplace';


@Injectable()
export class WorkplaceService extends GlobalService {

  url_workplaces = environment.url_base_api + environment.paths_api.workplaces;

  constructor(public http: HttpClient) {
    super();
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_workplaces + '/' + id,
      {headers: headers}
    );
  }

  list(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_workplaces,
      {headers: headers}
    );
  }

  remove(workplace: Workplace): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      workplace.url,
      {headers: headers}
    );
  }
}
