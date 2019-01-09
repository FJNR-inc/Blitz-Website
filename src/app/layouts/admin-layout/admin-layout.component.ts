import { Component, OnInit } from '@angular/core';
import {InternationalizationService} from '../../services/internationalization.service';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div id="container">
      <div id="content">
        <div class="left-nav">
          <div class="left-nav__content">
            <span class="left-nav__content__header">
              {{ 'admin-layout.left-nav.title' | translate }}
            </span>
            <a routerLink="/admin/users" class="left-nav__content__item">
              <i class="fa fa-users"></i>
              {{ 'admin-layout.left-nav.users' | translate }}
            </a>
            <a routerLink="/admin/organizations" class="left-nav__content__item">
              <i class="fas fa-university"></i>
              {{ 'admin-layout.left-nav.universities' | translate }}
            </a>
            <a routerLink="/admin/academics" class="left-nav__content__item">
              <i class="fas fa-graduation-cap"></i>
              {{ 'admin-layout.left-nav.studies' | translate }}
            </a>
            <a routerLink="/admin/workplaces" class="left-nav__content__item">
              <i class="fas fa-building"></i>
              {{ 'admin-layout.left-nav.spaces' | translate }}
            </a>
            <a routerLink="/admin/memberships" class="left-nav__content__item">
              <i class="fas fa-address-card"></i>
              {{ 'admin-layout.left-nav.type_of_memberships' | translate }}
            </a>
            <a routerLink="/admin/offers" class="left-nav__content__item">
              <i class="fas fa-hand-holding-usd"></i>
              {{ 'admin-layout.left-nav.type_of_packages' | translate }}
            </a>
            <a routerLink="/admin/export" class="left-nav__content__item">
              <i class="fas fa-file-export"></i>
              {{ 'admin-layout.left-nav.export' | translate }}
            </a>
            <a routerLink="/admin/documentation" class="left-nav__content__item">
              <i class="fas fa-book"></i>
              {{ 'admin-layout.left-nav.documentation' | translate }}
            </a>
            <a routerLink="/admin/retirements" class="left-nav__content__item">
              <i class="fas fa-place-of-worship"></i>
              {{ 'admin-layout.left-nav.retirements' | translate }}
            </a>
            <a routerLink="/admin/coupons" class="left-nav__content__item">
              <i class="fas fa-ticket-alt"></i>
              {{ 'admin-layout.left-nav.coupons' | translate }}
            </a>
            <a routerLink="/" class="left-nav__content__item">
              <i class="fas fa-door-open"></i>
              {{ 'admin-layout.left-nav.exit' | translate }}
            </a>
          </div>
          <div class="left-nav__footer">
            <div class="left-nav__footer__languages">
              <a class="left-nav__footer__languages__item" (click)="changeLanguage('en')">EN</a>
              <a class="left-nav__footer__languages__item" (click)="changeLanguage('fr')">FR</a>
            </div>
          </div>
        </div>
        <div id="main">
          <router-outlet></router-outlet>
        </div>
      </div>
      <div id="footer">
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styleUrls: ['admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {

  constructor(private internationalizationService: InternationalizationService) { }

  ngOnInit() {
  }

  changeLanguage(language: string) {
    this.internationalizationService.setLocale(language);
  }
}
