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
            <a [routerLink]="item.routerLink"
               class="left-nav__content__item"
               *ngFor="let item of nav"
               [appHasPermissions]="item.permissions">
              <i [class]="item.icon"></i>
              {{ item.label | translate }}
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

  nav = [
    {
      label: 'admin-layout.left-nav.dashboard',
      icon: 'fas fa-tachometer-alt',
      routerLink: '/admin',
      permissions: [
        'can_access_admin_dashboard',
      ],
    },
    {
      label: 'admin-layout.left-nav.users',
      icon: 'fa fa-users',
      routerLink: '/admin/users',
      permissions: [
        'can_access_admin_users'
      ],
    },
    {
      label: 'admin-layout.left-nav.universities',
      icon: 'fas fa-university',
      routerLink: '/admin/organizations',
      permissions: [
        'can_access_admin_organizations'
      ],
    },
    {
      label: 'admin-layout.left-nav.studies',
      icon: 'fas fa-graduation-cap',
      routerLink: '/admin/academics',
      permissions: [
        'can_access_admin_academics'
      ],
    },
    {
      label: 'admin-layout.left-nav.spaces',
      icon: 'fas fa-building',
      routerLink: '/admin/workplaces',
      permissions: [
        'can_access_admin_workplaces'
      ],
    },
    {
      label: 'admin-layout.left-nav.type_of_memberships',
      icon: 'fas fa-address-card',
      routerLink: '/admin/memberships',
      permissions: [
        'can_access_admin_memberships'
      ],
    },
    {
      label: 'admin-layout.left-nav.type_of_packages',
      icon: 'fas fa-hand-holding-usd',
      routerLink: '/admin/offers',
      permissions: [
        'can_access_admin_packages'
      ],
    },
    {
      label: 'admin-layout.left-nav.export',
      icon: 'fas fa-file-export',
      routerLink: '/admin/export',
      permissions: [
        'can_access_admin_exports'
      ],
    },
    {
      label: 'admin-layout.left-nav.documentation',
      icon: 'fas fa-book',
      routerLink: '/admin/documentation',
      permissions: [
        'can_access_admin_documentation'
      ],
    },
    {
      label: 'admin-layout.left-nav.retirements',
      icon: 'fas fa-place-of-worship',
      routerLink: '/admin/retirements',
      permissions: [
        'can_access_admin_retirements'
      ],
    },
    {
      label: 'admin-layout.left-nav.coupons',
      icon: 'fas fa-ticket-alt',
      routerLink: '/admin/coupons',
      permissions: [
        'can_access_admin_coupons'
      ],
    },
    {
      label: 'admin-layout.left-nav.exit',
      icon: 'fas fa-door-open',
      routerLink: '/',
    },
  ];

  constructor(private internationalizationService: InternationalizationService) { }

  ngOnInit() {
  }

  changeLanguage(language: string) {
    this.internationalizationService.setLocale(language);
  }
}
