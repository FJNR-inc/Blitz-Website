import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import GlobalService from './globalService';
import { environment } from '../../environments/environment';

@Injectable()
export class CardService extends GlobalService {

  url_cards = environment.url_base_api + environment.paths_api.cards;

  constructor(public http: HttpClient) {
    super();
  }

  list(filters: {name: string, value: any}[] = null, limit = 100, offset = 0): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());

    if (filters != null) {
      for (const filter of filters) {
        if (filter.name === 'owner') {
          params = params.set('owner', filter.value);
        }
        if (filter.name === 'payment_token') {
          params = params.set('payment_token', filter.value);
        }
      }
    }

    return this.http.get<any>(
      this.url_cards,
      {headers: headers, params: params}
    );
  }

  remove(paymentProfile: number, cardId): Observable<any> {
    const headers = this.getHeaders();
    return this.http.request<any>(
      'delete',
      this.url_cards + '/' + paymentProfile + '/cards/' + cardId,
      {
        headers: headers
      }
    );
  }
}
