import { Injectable } from '@angular/core';
import GlobalService from './globalService';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RetreatReservation} from '../models/retreatReservation';

@Injectable({
  providedIn: 'root'
})
export class CKEditorPageService extends GlobalService  {

  urlCKEditorPage = environment.url_base_api + environment.paths_api.urlCKEditorPage;

  constructor(public http: HttpClient) {
    super();
  }

  get(keyPage: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.urlCKEditorPage + '/?key=' + keyPage,
      {headers: headers}
    ).pipe(
      map((data) => {
        return data.results.length > 0 ? data.results[0] : null;
      })
    );
  }

  update(url: string, ckEditorPage): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      ckEditorPage,
      {headers: headers}
    );
  }
}
