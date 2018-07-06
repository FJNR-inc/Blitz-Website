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
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_pictures,
      picture,
      {headers: headers}
    );
  }

  remove(picture: Picture): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      picture.picture,
      {headers: headers}
    );
  }
}
