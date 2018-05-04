import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import GlobalService from './globalService';
import { User } from '../models/user';
import { environment } from '../../environments/environment';


@Injectable()
export class UserService extends GlobalService {

  url_users = environment.url_base_api + environment.paths_api.users;
  url_activation = environment.url_base_api + environment.paths_api.activation;

  constructor(public http: HttpClient) {
    super();
  }

  createUser(user: User, password: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_users,
      {
        password: password,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        other_phone: user.other_phone,
      },
      {headers: headers}
    );
  }
}
