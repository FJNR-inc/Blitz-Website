import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div id="container">
      <div id="header">
        <app-header></app-header>
      </div>
      <div id="content">
        <div class="left-nav">
          <span class="left-nav__header">
            Administration
          </span>
          <a href="" class="left-nav__item">
            <i class="fas fa-chart-area"></i>
            Général
          </a>
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
            Etudes
          </a>
          <a routerLink="/admin/workplaces" class="left-nav__item">
            <i class="fas fa-building"></i>
            Espaces de travail
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
