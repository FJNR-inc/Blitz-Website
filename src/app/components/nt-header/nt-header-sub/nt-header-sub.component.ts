import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nt-header-sub',
  templateUrl: './nt-header-sub.component.html',
  styleUrls: ['./nt-header-sub.component.scss']
})
export class NtHeaderSubComponent implements OnInit {

  @Input() title: string;
  @Input() nav;
  @Input() hover = false;

  @Output() itemClicked: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  clickNav(nav) {
    if (nav.router_url) {
      this.itemClicked.emit(nav);
    }
  }

}
