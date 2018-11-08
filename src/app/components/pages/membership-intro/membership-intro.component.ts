import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-membership-intro',
  templateUrl: './membership-intro.component.html',
  styleUrls: ['./membership-intro.component.scss']
})
export class MembershipIntroComponent implements OnInit {

  menuActive = null;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

}
