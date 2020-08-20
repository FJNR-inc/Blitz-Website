import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import {Retreat} from '../models/retreat';

@Injectable()
export class RetreatService extends GlobalService {

  url_retreats = environment.url_base_api + environment.paths_api.retreats;

  constructor(public http: HttpClient) {
    super();
  }

  create(retreat: Retreat): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_retreats,
      retreat,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_retreats + '/' + id,
      {headers: headers}
    );
  }

  getByUrl(url: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      url,
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
        if (filter.name === 'is_active') {
          params = params.set('is_active', filter.value);
        }
        if (filter.name === 'hidden') {
          params = params.set('hidden', filter.value);
        }
        if (filter.name === 'name') {
          params = params.set('name', filter.value);
        }
        if (filter.name === 'end_time__gte') {
          params = params.set('end_time__gte', filter.value);
        }
        if (filter.name === 'ordering') {
          params = params.set('ordering', filter.value);
        }
        if (filter.name === 'type') {
          params = params.set('type__id', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_retreats,
      {headers: headers, params: params}
    );
  }

  update(url: string, retreat: Retreat): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      retreat,
      {headers: headers}
    );
  }

  activate(url: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      url + '/activate',
      {},
      {headers: headers}
    );
  }

  remove(retreat: Retreat): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      retreat.url,
      {headers: headers}
    );
  }


  exportReservations(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_retreats + '/' + id + '/export_participation',
      {headers: headers}
    );
  }

  exportOptions(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_retreats + '/' + id + '/export_options',
      {headers: headers}
    );
  }
}
