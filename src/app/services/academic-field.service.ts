import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
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

  list(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_academic_fields,
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

  remove(field: AcademicField): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      field.url,
      {headers: headers}
    );
  }
}
