import {EventEmitter, Injectable, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../environments/environment';

@Injectable()
export class InternationalizationService {

  locales = ['en', 'fr'];
  @Output() locale: EventEmitter<any> = new EventEmitter();

  constructor(private translate: TranslateService) { }

  static getLocale(force: boolean = false) {
    /*
    force:
      if true, this function return the exact string stored in localStorage
      if false, this function return the locale to use depending of multiple element and configuration
     */
    const locale = JSON.parse(localStorage.getItem('locale'));
    if (locale || force) {
      return locale;
    } else {
      return environment.default_language;
    }
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
