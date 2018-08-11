import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Picture } from '../models/picture';

@Injectable()
export class PictureService extends GlobalService {

  url_pictures = environment.url_base_api + environment.paths_api.pictures;

  constructor(public http: HttpClient) {
    super();
  }

  create(picture: Picture): Observable<any> {
    const headers = this.getHeaders(null);
    const formData = new FormData();
    formData.append('picture', picture.picture);
    formData.append('workplace', picture.workplace);
    formData.append('name', picture.name);
    return this.http.post<any>(
      this.url_pictures,
      formData,
      {headers: headers}
    );
  }

  list(filters: {name: string, value: any}[] = null, limit: number = 100, offset: number = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    if (filters != null) {
      for (const filter of filters) {
        if (filter.name === 'workplace') {
          params = params.set('workplace', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_pictures,
      {headers: headers, params: params}
    );
  }

  remove(picture: Picture): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      picture.url,
      {headers: headers}
    );
  }
}
