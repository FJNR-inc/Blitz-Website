import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import GlobalService from './globalService';
import {User} from '../models/user';

interface AuthenticationResponse {
  token: string;
}

@Injectable()
export class AuthenticationService extends GlobalService {

  @Output() profile: EventEmitter<any> = new EventEmitter();

  url_authentication = environment.url_base_api + environment.paths_api.authentication;
  url_reset_password = environment.url_base_api + environment.paths_api.reset_password;
  url_change_password = environment.url_base_api + environment.paths_api.change_password;
  url_activate_user = environment.url_base_api + environment.paths_api.activate_user;

  constructor(public http: HttpClient) {
    super();
  }

  authenticate(login: string, password: string): Observable<AuthenticationResponse> {
    const headers = this.getHeaders();
    return this.http.post<AuthenticationResponse>(
      this.url_authentication,
      {
        username: login,
        password: password
      },
      {headers: headers}
    );
  }

  logout(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      this.url_authentication + '/' + localStorage.getItem('token'),
      {headers: headers}
    );
  }

  resetPassword(email: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_reset_password,
      {
        email: email
      },
      {headers: headers}
    );
  }

  changePassword(token: string, password: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_change_password,
      {
        token: token,
        new_password: password
      },
      {headers: headers}
    );
  }

  activate(token: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_activate_user,
      {
        activation_token: token
      },
      {headers: headers}
    );
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    }

    return false;
  }

  isAdmin() {
    const profile = this.getProfile();
    if (profile) {
      return profile.is_superuser;
    } else {
      return false;
    }
  }

  isVolunteer(workplaceUrl: string = null) {
    const profile = this.getProfile();
    let workplaces = [];
    if (profile) {
      workplaces = profile.volunteer_for_workplace;
    }

    if (workplaces && workplaces.length) {
      if (workplaceUrl) {
        // User need to be volunteer on this exact workplace
        for (const workplace of workplaces) {
          if (workplace === workplaceUrl) {
            return true;
          }
        }
      } else {
        // User just need to be volunteer on a workplace
        return true;
      }
    }

    return false;
  }

  getProfile() {
    return new User(JSON.parse(localStorage.getItem('userProfile')));
  }

  setProfile(profile) {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    this.profile.emit(profile);
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return JSON.parse(localStorage.getItem('token'));
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  hasPermissions(permissions: string[]) {
    // Shortcut for admin only
    if (this.isAdmin()) {
      return true;
    }

    // Define here all the default permissions
    const list_permissions: string[] = [];

    if (this.isVolunteer()) {
      list_permissions.push('access_admin_panel');
      list_permissions.push('can_access_admin_dashboard');
      list_permissions.push('can_access_admin_workplaces');
      list_permissions.push('can_edit_presence');
    }

    for (const permission in permissions) {
      if (list_permissions.indexOf(permissions[permission]) === -1) {
        return false;
      }
    }
    return true;
  }
}
