import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-background-layout',
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
  styleUrls: ['background-layout.component.scss']
})
export class BackgroundLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
