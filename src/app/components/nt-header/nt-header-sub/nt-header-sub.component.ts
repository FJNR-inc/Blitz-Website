import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nt-header-sub',
  templateUrl: './nt-header-sub.component.html',
  styleUrls: ['./nt-header-sub.component.scss']
})
export class NtHeaderSubComponent implements OnInit {

  @Input() title: string;
  @Input() nav;
  @Input() currentNav;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  clickNav(nav) {

    if (nav.url) {
      this.router.navigate(nav.url);
    }
  }

}
