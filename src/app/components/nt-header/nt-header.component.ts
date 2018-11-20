import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../models/user';
import {ProfileService} from '../../services/profile.service';
import {InternationalizationService} from '../../services/internationalization.service';

@Component({
  selector: 'app-nt-header',
  templateUrl: './nt-header.component.html',
  styleUrls: ['./nt-header.component.scss']
})
export class NtHeaderComponent implements OnInit {

  isOpen = false;
  user: User = null;
  locale: string;

  constructor(private authenticationService: AuthenticationService,
              private profileService: ProfileService,
              private internationalizationService: InternationalizationService) { }

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.profileService.get().subscribe(
        profile => {
          this.authenticationService.setProfile(profile);
          this.user = new User(this.authenticationService.getProfile());
          this.authenticationService.profile.subscribe(
            emitedProfile => this.user = new User(emitedProfile)
          );
        }
      );
    }
    this.getCurrentLanguage();
  }

  toggleHeader() {
    this.isOpen = !this.isOpen;
  }

  closeHeader() {
    this.isOpen = false;
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  isAdmin() {
    return this.authenticationService.isAdmin();
  }

  changeLanguage(language: string) {
    this.internationalizationService.setLocale(language);
  }

  getCurrentLanguage() {
    this.locale = InternationalizationService.getLocale();
    this.subscribeToLocaleChange();
  }

  subscribeToLocaleChange() {
    this.internationalizationService.locale.subscribe(
      emitedLocale => {
        this.locale = emitedLocale;
      }
    );
  }
}
