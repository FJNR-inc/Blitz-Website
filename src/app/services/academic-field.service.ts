import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { AcademicField } from '../models/academicField';


@Injectable()
export class AcademicFieldService extends GlobalService {

  url_academic_fields = environment.url_base_api + environment.paths_api.academic_fields;
  url_academic_fields_export = environment.url_base_api + environment.paths_api.academic_fields_export;

  constructor(public http: HttpClient) {
    super();
  }

  create(academicField: AcademicField): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_academic_fields,
      academicField,
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

  update(url: string, academicField: AcademicField): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      academicField,
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

  export(page: number = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', page.toString());
    return this.http.get<any>(
      this.url_academic_fields_export,
      {
        headers: headers,
        params: params,
      });
  }
}
