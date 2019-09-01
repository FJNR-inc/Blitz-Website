import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import GlobalService from './globalService';
import {environment} from '../../environments/environment';
import {Retreat} from '../models/retreat';
import {RetreatInvitation} from '../models/RetreatInvitation';

@Injectable({
  providedIn: 'root'
})
export class RetreatInvitationService extends GlobalService {
  url_retreat_invitation =
    environment.url_base_api +
    environment.paths_api.retreatInvitations;

  constructor(public http: HttpClient) {
    super();
  }

  create(invitation: RetreatInvitation): Observable<RetreatInvitation> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_retreat_invitation,
      invitation,
      {headers: headers}
    );
  }

  update(invitation: RetreatInvitation, data): Observable<RetreatInvitation> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      invitation.url,
      data,
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
        if (filter.name === 'retreat') {
          params = params.set('retreat', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_retreat_invitation,
      {headers: headers, params: params}
    );
  }
}
