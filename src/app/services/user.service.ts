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

  create(user: User, password: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_users,
      {
        password: password,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        gender: user.gender,
        university: {
          name: user.university
        },
        academic_field: {
          name: user.academic_field,
        },
        academic_level: {
          name: user.academic_level
        },
        birthdate: user.birthdate,
      },
      {headers: headers}
    );
  }

  list(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_users,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_users + '/' + id,
      {headers: headers}
    );
  }
}
