import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';
import {InternationalizationService} from './services/internationalization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public options = {
    position: ['bottom', 'right'],
    timeOut: 5000,
    lastOnBottom: true,
    preventDuplicates: true,
  };

  constructor(private translate: TranslateService,
              private internationalizationService: InternationalizationService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(environment.default_language);

    // todo: This section is working but we wait english translation for the moment
    this.internationalizationService.setLocale('fr');
    /*****************
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    if (!InternationalizationService.getLocale(true)) {
      // if no locale are set in localStorage we detect the default language of the browser
      this.internationalizationService.setLocale(translate.getBrowserLang());
    } else {
      translate.use(InternationalizationService.getLocale());
    }
     ****************/
  }
}
