import {Injectable} from '@angular/core';
import GlobalService from './globalService';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {ProfileService} from './profile.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {INewsletterInscription} from '../models/newsletterInscription';
import {UserService} from './user.service';
import {User} from '../models/user';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService extends GlobalService {

  LOCAL_STORAGE_HIDE_ITEM = 'newsletter-hide';
  urlNewsletterInscription = environment.url_base_api + '/mail_chimp';

  constructor(public http: HttpClient,
              private auth: AuthenticationService,
              private profileService: ProfileService,
              private userService: UserService) {
    super();
  }

  newsletterInscription(userInformation: INewsletterInscription): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      this.urlNewsletterInscription,
      userInformation,
      {headers: headers}
    ).pipe(
      tap(
        () => {
          this.hideNewsletter();
        }
      ));
  }

  hideNewsletter() {
    this.localStorageHideNewsletter = true;
    this.profileHideNewsletter = true;
  }

  get isNewsletterHidden() {
    return this.localStorageHideNewsletter ||
      this.profileHideNewsletter;
  }

  get localStorageHideNewsletter(): boolean {
    return JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_HIDE_ITEM));
  }

  set localStorageHideNewsletter(hide: boolean) {
    localStorage.setItem(this.LOCAL_STORAGE_HIDE_ITEM, JSON.stringify(hide));
  }

  get profileHideNewsletter(): boolean {
    if (this.auth.isAuthenticated()) {

      const profile = this.auth.getProfile();
      return profile.hide_newsletter || profile.is_in_newsletter;
    } else {
      return false;
    }
  }

  set profileHideNewsletter(hide: boolean) {
    if (this.auth.isAuthenticated()) {
      const profile = this.auth.getProfile();
      profile.hide_newsletter = hide;
      this.userService.update(
        profile.url,
        profile
      ).subscribe(
        (user: User) => {
          this.auth.setProfile(user);
        }
      );
    }
  }
}
