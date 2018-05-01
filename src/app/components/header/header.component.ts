import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {

    responsive = false;

    constructor() { }

    closeResponsiveNavbar() {
        this.responsive = false;
    }

    toogleResponsiveNavbar() {
        this.responsive = !this.responsive;
    }
}
