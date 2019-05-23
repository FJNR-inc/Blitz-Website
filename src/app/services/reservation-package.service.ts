import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';
import { ReservationPackage } from '../models/reservationPackage';

@Injectable()
export class ReservationPackageService extends GlobalService {

  url_reservationPackages = environment.url_base_api + environment.paths_api.reservationPackages;
  url_reservationPackages_export = environment.url_base_api + environment.paths_api.reservationPackages_export;
  constructor(public http: HttpClient) {
    super();
  }

  create(reservationPackage: ReservationPackage): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.url_reservationPackages,
      reservationPackage,
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
        if (filter.name === 'exclusive_memberships') {
          if (filter.value === null) {
            params = params.set('exclusive_memberships__isnull', 'true');
          } else {
            params = params.set('exclusive_memberships', filter.value);
          }
        }
        if (filter.name === 'available') {
          params = params.set('available', filter.value);
        }
      }
    }

    return this.http.get<any>(
      this.url_reservationPackages,
      {headers: headers, params: params}
    );
  }

  get(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      this.url_reservationPackages + '/' + id,
      {headers: headers}
    );
  }

  update(url: string, reservationPackage: ReservationPackage): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(
      url,
      reservationPackage,
      {headers: headers}
    );
  }

  remove(reservationPackage: ReservationPackage): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(
      reservationPackage.url,
      {headers: headers}
    );
  }

  export(page: number = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', page.toString());
    return this.http.get<any>(
      this.url_reservationPackages_export,
      {
        headers: headers,
        params: params,
      });
  }
}
