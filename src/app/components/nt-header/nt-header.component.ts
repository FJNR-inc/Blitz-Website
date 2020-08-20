import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../models/user';
import {ProfileService} from '../../services/profile.service';
import {InternationalizationService} from '../../services/internationalization.service';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {environment} from '../../../environments/environment';
import {MyModalService} from '../../services/my-modal/my-modal.service';

@Component({
  selector: 'app-nt-header',
  templateUrl: './nt-header.component.html',
  styleUrls: ['./nt-header.component.scss']
})
export class NtHeaderComponent implements OnInit {

  isOpen = false;
  user: User = null;
  locale: string;

  selectedNav;
  isNavClicked = false;

  // Actual position
  curentFirstLevel;
  curentSecondLevel;

  // Expand or not the main part of the nav
  showNav = true;

  // Expand or not the responsive content
  isResponsiveOpened = false;

  socials = [
    {
      icon: 'icon icon-facebook icon--2x',
      url: 'https://facebook.com/thesezvous/',
      alt: 'Facebook'
    }, {
      icon: 'icon icon-instagram icon--2x',
      url: 'https://www.instagram.com/thesezvous',
      alt: 'Instagram'
    }, {
      icon: 'icon icon-twitter icon--2x',
      url: 'https://twitter.com/ThesezVous',
      alt: 'Twitter'
    }, {
      icon: 'icon icon-linkedin icon--2x',
      url: 'https://www.linkedin.com/company/thesezvous',
      alt: 'LinkedIn'
    }];

  nav: any[] = [
    {
      label: _('header.virtual_activities.title'),
      url: '',
      router_url: '/virtual-activities',
    }, {
      label: _('header.retreat.title'),
      url: '',
      router_url: '/retreats/' + environment.defaultRetreatId,
    }, {
      label: _('header.espace.title'),
      url: '',
      router_url: '/reservation/' + environment.defaultWorkplaceId,
    }, {
      label: _('header.pilot_project'),
      url: 'https://www.thesez-vous.com/projets-pilotes.html',
      router_url: '',
    }, {
      label: _('header.membership.title'),
      url: '',
      router_url: '/membership/intro',
    }, {
      label: _('header.about.title'),
      url: 'http://www.thesez-vous.com',
      router_url: '',
    }, {
      label: _('header.contact'),
      url: 'https://www.thesez-vous.com/contactez-nous.html',
      router_url: '',
    }
  ];

  multilingual_activated = environment.multilingual_activated;

  modalEnglishNotAvailable = 'english_not_available_modal';

  constructor(private authenticationService: AuthenticationService,
              private profileService: ProfileService,
              private internationalizationService: InternationalizationService,
              private router: Router,
              private translate: TranslateService,
              private myModalService: MyModalService) {
  }

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

    this.getCurrentNav();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getCurrentNav();
      }
    });
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  isAdmin() {
    return this.authenticationService.isAdmin();
  }

  isVolunteer() {
    return this.authenticationService.isVolunteer();
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

  enterNav(nav) {
    if (!this.isNavClicked) {
      this.selectedNav = nav;
    }
  }

  leaveNav() {
    if (!this.isNavClicked) {
      this.selectedNav = null;
    }
  }

  clearNav() {
    this.isNavClicked = false;
    this.selectedNav = null;
    if (this.curentSecondLevel) {
      this.showNav = false;
    }
  }

  clickNav(nav, secondLevel = false) {
    if (nav.router_url) {
      if (secondLevel) {
        this.isResponsiveOpened = false;
      }
      this.router.navigate([nav.router_url]);
    } else {
      if (!nav.nav) {
        this.isResponsiveOpened = false;
        this.selectedNav = null;
        this.isNavClicked = false;
      } else {
        if (nav === this.selectedNav && this.isNavClicked) {
          this.isNavClicked = false;
          this.selectedNav = null;
        } else {
          this.isNavClicked = true;
          this.selectedNav = nav;
        }
      }
    }
  }

  /**
   * Analyse current url to check if it's part of the navbar and update the navbar display
   */
  getCurrentNav() {

    const url = this.router.url;
    this.curentFirstLevel = null;
    this.curentSecondLevel = null;

    this.nav.forEach(firstLevel => {
      if (firstLevel.router_url) {
        if (firstLevel.router_url === url) {
          this.curentFirstLevel = firstLevel;
        }
      } else if (firstLevel.nav) {
        firstLevel.nav.forEach(secondLevel => {
          if (secondLevel.router_url) {
            if (secondLevel.router_url === url) {

              this.showNav = false;
              this.curentFirstLevel = firstLevel;
              this.curentSecondLevel = secondLevel;
            }
          }
        });
      }
    });
  }

  openNav() {
    this.showNav = true;
  }

  getFirstLevelTitle() {
    if (this.selectedNav) {
      return this.selectedNav.label;
    } else if (this.curentFirstLevel) {
      return this.curentFirstLevel.label;
    } else {
      return null;
    }
  }

  getSecondLevel() {
    if (this.selectedNav) {
      if (this.selectedNav.nav) {
        return this.selectedNav.nav;
      } else {
        return null;
      }
    } else if (this.curentSecondLevel) {

      if (this.curentSecondLevel.keepClose) {
        return null;
      } else {
        return this.curentFirstLevel.nav;
      }
    } else {
      return null;
    }
  }

  getSelectedSecondLevel() {
    if (this.selectedNav) {
      return this.selectedNav;
    } else if (this.curentSecondLevel) {
      return this.curentSecondLevel;
    } else {
      return null;
    }
  }

  toggleResponsiveNav() {
    this.isResponsiveOpened = !this.isResponsiveOpened;
  }

  openEnglishModal() {
    const modal = this.myModalService.get(this.modalEnglishNotAvailable);

    if (!modal) {
      return;
    }

    modal.toggle();
  }

  closeEnglishModal() {

    const modal = this.myModalService.get(this.modalEnglishNotAvailable);

    if (!modal) {
      return;
    }

    modal.close();
  }
}
