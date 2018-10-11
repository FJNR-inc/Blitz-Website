import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div id="container">
      <div id="content">
        <div class="left-nav">
          <span class="left-nav__header">
            Administration
          </span>
          <a routerLink="/admin/users" class="left-nav__item">
            <i class="fa fa-users"></i>
            Utilisateurs
          </a>
          <a routerLink="/admin/organizations" class="left-nav__item">
            <i class="fas fa-university"></i>
            Universités
          </a>
          <a routerLink="/admin/academics" class="left-nav__item">
            <i class="fas fa-graduation-cap"></i>
            Études
          </a>
          <a routerLink="/admin/workplaces" class="left-nav__item">
            <i class="fas fa-building"></i>
            Espaces de travail
          </a>
          <a routerLink="/admin/periods" class="left-nav__item">
            <i class="fas fa-calendar-alt"></i>
            Périodes de réservations
          </a>
          <a routerLink="/admin/memberships" class="left-nav__item">
            <i class="fas fa-address-card"></i>
            Type de membership
          </a>
          <a routerLink="/admin/offers" class="left-nav__item">
            <i class="fas fa-hand-holding-usd"></i>
            Forfaits
          </a>
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

  constructor() { }

  ngOnInit() {
  }

}
