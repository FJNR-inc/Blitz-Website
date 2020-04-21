import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-light-layout',
  template: `
    <div class="light-layout">
      <div class="light-layout__content">
        <div>
          <router-outlet></router-outlet>
        </div>
        <app-newsletter-footer></app-newsletter-footer>
      </div>
      <div class="light-layout__right-panel">
        <app-right-panel-container></app-right-panel-container>
      </div>
    </div>
  `,
  styleUrls: ['light-layout.component.scss'],
})
export class LightLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
