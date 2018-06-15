import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { AcademicField } from '../models/academicField';


@Injectable()
export class AcademicFieldService extends GlobalService {

  url_academic_fields = environment.url_base_api + environment.paths_api.academic_fields;

  constructor(public http: HttpClient) {
    super();
  }

  create(name: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_academic_fields,
      {
        'name': name
      },
      {headers: headers}
    );
  }

  list(limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    return this.http.get<any>(
      this.url_academic_fields,
      {headers: headers, params: params}
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

  remove(field: AcademicField): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      field.url,
      {headers: headers}
    );
  }
}
