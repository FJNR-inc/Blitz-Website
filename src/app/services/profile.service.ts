import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';


@Injectable()
export class ProfileService extends GlobalService {

  url_profile = environment.url_base_api + environment.paths_api.profile;

  constructor(public http: HttpClient) {
    super();
  }

  get(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_profile,
      {headers: headers}
    );
  }
}
