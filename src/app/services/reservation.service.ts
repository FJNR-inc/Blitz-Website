import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { Reservation } from '../models/reservation';

@Injectable()
export class ReservationService extends GlobalService {

  url_reservations = environment.url_base_api + environment.paths_api.reservations;

  constructor(public http: HttpClient) {
    super();
  }

  create(reservation: Reservation): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_reservations,
      reservation,
      {headers: headers}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_reservations + '/' + id,
      {headers: headers}
    );
  }

  list(filters: {name: string, value: any}[] = null, limit: number = 100, offset: number = 0, ordering: string = null): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());
    if (filters != null) {
      for (const filter of filters) {
        if (filter.name === 'user') {
          params = params.set('user', filter.value);
        }
        if (filter.name === 'timeslot') {
          params = params.set('timeslot', filter.value);
        }
      }
    }
    return this.http.get<any>(
      this.url_reservations,
      {headers: headers, params: params}
    );
  }

  update(url: string, reservation: Reservation): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      reservation,
      {headers: headers}
    );
  }

  remove(reservation: Reservation): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      reservation.url,
      {headers: headers}
    );
  }
}
