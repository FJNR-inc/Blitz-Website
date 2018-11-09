import {EventEmitter, Injectable, Output} from '@angular/core';
import {User} from '../models/user';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class InternationalizationService {

  locales = ['en', 'fr'];
  @Output() locale: EventEmitter<any> = new EventEmitter();

  constructor(private translate: TranslateService) { }

  static getLocale() {
    return JSON.parse(localStorage.getItem('locale'));
  }

  setLocale(locale: string) {
    if (this.locales.lastIndexOf(locale) > -1) {
      this.translate.use(locale);
      localStorage.setItem('locale', JSON.stringify(locale));
      this.locale.emit(locale);
    } else {
      console.error('This locale is not defined in the internationalization service!');
    }
  }
}
