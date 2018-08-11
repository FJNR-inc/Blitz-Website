import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-default-layout',
  template: `
    <div id="container">
      <div id="header">
        <app-header></app-header>
      </div>
      <div id="content">
        <router-outlet></router-outlet>
      </div>
      <div id="footer">
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: []
})
export class DefaultLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
