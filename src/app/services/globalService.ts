import { HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

export default class GlobalService {

  getHeaders(contentType: string = 'application/json') {
    const options = {
      'Accept-Language': environment.default_language
    };

    const token = localStorage.getItem('token');
    if (contentType) {
      options['Content-Type'] = contentType;
    }
    if (token) {
      options['Authorization'] = 'Token ' + token;
    }
    const header = new HttpHeaders(options);
    return header;
  }
}
