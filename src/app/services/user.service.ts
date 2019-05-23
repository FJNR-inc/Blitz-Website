import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { User } from '../models/user';
import { environment } from '../../environments/environment';


@Injectable()
export class UserService extends GlobalService {

  url_users = environment.url_base_api + environment.paths_api.users;
  url_activation = environment.url_base_api + environment.paths_api.activation;
  url_users_export = environment.url_base_api + environment.paths_api.users_export;

  constructor(public http: HttpClient) {
    super();
  }

  create(user: User, password: string): Observable<any> {
    const headers = this.getHeaders();
    const body = {
      password: password,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      birthdate: user.birthdate
    };

    if (user.university) {
      body['university'] = {
        name: user.university
      };
    }

    if (user.academic_field) {
      body['academic_field'] = {
        name: user.academic_field
      };
    }

    if (user.academic_level) {
      body['academic_level'] = {
        name: user.academic_level
      };
    }

    return this.http.post<any>(
      this.url_users,
      body,
      {headers: headers}
    );
  }

  activateToken(token: string): Observable<any>  {
    const headers = this.getHeaders();

    return this.http.post<any>(
      this.url_activation,
      {'activation_token': token},
      {headers: headers}
    );
  }

  list(filters: {name: string, value: any}[] = null, limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());

    if (filters != null) {
      for (const filter of filters) {
        let name = '';
        if (filter.name === 'first_name') {
          name = 'first_name';
        } else if (filter.name === 'last_name') {
          name = 'last_name';
        } else if (filter.name === 'membership') {
          name = 'membership';
        } else if (filter.name === 'search') {
          name = 'search';
        }

        if (name) {
          params = params.set(name, filter.value);
        }
      }
    }

    return this.http.get<any>(
      this.url_users,
      {headers: headers, params: params}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_users + '/' + id,
      {headers: headers}
    );
  }

  update(url: string, user: User): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      user,
      {headers: headers}
    );
  }

  remove(user: User): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      user.url,
      {headers: headers}
    );
  }

  export(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_users_export,
       {
        headers: headers,
      });
  }
}
