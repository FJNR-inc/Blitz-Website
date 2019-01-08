import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../models/user';
import {ProfileService} from '../../services/profile.service';
import {InternationalizationService} from '../../services/internationalization.service';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

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
      label: _('À propos'),
      url: '',
      router_url: '',
      nav: [
        {
          label: _('Mission'),
          url: 'http://www.thesez-vous.com/agrave-propos.html',
          router_url: ''
        }, {
          label: _('Historique'),
          url: 'http://www.thesez-vous.com/historique.html',
          router_url: ''
        }, {
          label: _('Équipe'),
          url: 'http://www.thesez-vous.com/equipe.html',
          router_url: ''
        }, {
          label: _('Revue de presse'),
          url: 'http://www.thesez-vous.com/revue-de-presse.html',
          router_url: ''
        }, {
          label: _('Prix et distinctions'),
          url: 'http://www.thesez-vous.com/prix-et-distinctions.html',
          router_url: ''
        }, {
          label: _('Besoin d’aide?'),
          url: 'http://www.thesez-vous.com/besoin-daide.html',
          router_url: '',
          type: 'button'
        }
      ]
    }, {
      label: _('Retraites'),
      url: '',
      router_url: '',
      nav: [
        {
          label: _('Qu\'est-ce?'),
          url: 'http://www.thesez-vous.com/questcequuneretraite.html',
          router_url: ''
        }, {
          label: _('Retraites hors ville'),
          url: 'http://www.thesez-vous.com/questcequuneretraite.html',
          router_url: ''
        }, {
          label: _('Bourses et financement'),
          url: 'http://www.thesez-vous.com/bourses-et-financement.html\n',
          router_url: ''
        }, {
          label: _('Partenariat SBL'),
          url: 'http://www.thesez-vous.com/sbl.html',
          router_url: ''
        }, {
          label: _('S\'inscrire'),
          url: '',
          router_url: '/retirements',
          type: 'button',
          keepClose: true
        }
      ]
    }, {
      label: _('Espace'),
      url: '',
      router_url: '',
      nav: [
        {
          label: _('Qu\'est-ce?'),
          url: '',
          router_url: ''
        }, {
          label: _('Fonctionnement'),
          url: 'http://www.thesez-vous.com/inscriptionespace.html',
          router_url: ''
        }, {
          label: _('Programmation'),
          url: 'http://www.thesez-vous.com/espace.html',
          router_url: ''
        }, {
          label: _('Réserver'),
          url: '',
          router_url: '/reservation/1',
          type: 'button'
        }
      ]
    }, {
      label: _('Membership'),
      url: '',
      router_url: '',
      nav: [
        {
          label: _('Étudiant'),
          url: 'http://www.thesez-vous.com/membre-etudiant.html',
          router_url: ''
        }, {
          label: _('Professeur'),
          url: 'http://www.thesez-vous.com/membreprof.html',
          router_url: ''
        }, {
          label: _('Allié'),
          url: 'http://www.thesez-vous.com/membreallie.html',
          router_url: ''
        }, {
          label: _('Communauté'),
          url: 'http://www.thesez-vous.com/communaute.html',
          router_url: ''
        }, {
          label: _('Termes et conditions'),
          url: 'http://www.thesez-vous.com/termes-et-conditions.html',
          router_url: ''
        }, {
          label: _('Portraits'),
          url: 'http://www.thesez-vous.com/portrait.html',
          router_url: ''
        }, {
          label: _('Devenir membre'),
          url: '',
          router_url: '/register',
          type: 'button'
        }
      ]
    }, {
      label: _('Ambassadeur.trices'),
      url: 'http://www.thesez-vous.com/reseau.html',
      router_url: '',

    }, {
      label: _('Actualité'),
      url: 'http://www.thesez-vous.com/blogue.html',
      router_url: '',

    }, {
      label: _('BiblioThèse'),
      url: 'http://www.thesez-vous.com/bibliothese.html',
      router_url: '',
    }, {
      label: _('Contact'),
      url: 'http://www.thesez-vous.com/contact.html',
      router_url: '',
    }
  ];

  constructor(private authenticationService: AuthenticationService,
              private profileService: ProfileService,
              private internationalizationService: InternationalizationService,
              private router: Router,
              private translate: TranslateService) {
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
    if (!this.isNavClicked) {
      this.selectedNav = null;
    }
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
}
