import { HttpHeaders } from '@angular/common/http';
import {InternationalizationService} from './internationalization.service';

export default class GlobalService {

  getHeaders(contentType: string = 'application/json') {
    const options = {
      'Accept-Language': InternationalizationService.getLocale()
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
