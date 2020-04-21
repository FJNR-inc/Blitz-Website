import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-new-layout',
  template: `
    <div class="new-layout">
      <div class="new-layout__nav">
        <app-nt-header></app-nt-header>
      </div>
      <div class="new-layout__container">
        <div class="new-layout__container__content">
          <div>
            <router-outlet></router-outlet>
          </div>
          <app-newsletter-footer></app-newsletter-footer>
        </div>
        <div class="new-layout__container__right-panel">
          <app-right-panel-container></app-right-panel-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['new-layout.component.scss'],
})
export class NewLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
