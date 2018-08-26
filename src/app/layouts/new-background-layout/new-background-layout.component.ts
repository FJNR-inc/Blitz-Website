import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-background-layout',
  template: `
    <div class="app-new-background-layout">
      <a routerLink="/">
        <img src="../../../assets/images/logo_general.svg" class="app-new-background-layout__logo" />
      </a>
      <div class="app-new-background-layout__container">
        <div class="app-new-background-layout__container__content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['new-background-layout.component.scss']
})
export class NewBackgroundLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
