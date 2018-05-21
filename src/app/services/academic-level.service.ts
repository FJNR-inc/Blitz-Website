import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { AcademicLevel } from '../models/academicLevel';


@Injectable()
export class AcademicLevelService extends GlobalService {

  url_academic_levels = environment.url_base_api + environment.paths_api.academic_levels;

  constructor(public http: HttpClient) {
    super();
  }

  create(name: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_academic_levels,
      {
        'name': name
      },
      {headers: headers}
    );
  }

  list(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_academic_levels,
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

  remove(level: AcademicLevel): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      level.url,
      {headers: headers}
    );
  }
}
