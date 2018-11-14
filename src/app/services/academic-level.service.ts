import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { AcademicLevel } from '../models/academicLevel';


@Injectable()
export class AcademicLevelService extends GlobalService {

  url_academic_levels = environment.url_base_api + environment.paths_api.academic_levels;

  constructor(public http: HttpClient) {
    super();
  }

  create(academicLevel: AcademicLevel): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_academic_levels,
      academicLevel,
      {headers: headers}
    );
  }

  list(limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    return this.http.get<any>(
      this.url_academic_levels,
      {headers: headers, params: params}
    );
  }

  update(url: string, academicLevel: AcademicLevel): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      academicLevel,
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
