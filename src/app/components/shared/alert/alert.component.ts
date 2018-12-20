import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() type: string;
  @Input() messages: string[];

  icons = {
    'warning': 'icon icon-warning icon--5x',
    'text-warning': 'icon icon-warning icon--5x icon--danger',
    'success': '../../../../assets/images/icons/icon_check.svg',
    'danger': '../../../../assets/images/icons/icon_attention.svg',
    'info': '../../../../assets/images/icons/icon_tomato.svg'
  };

  constructor() { }

  ngOnInit() {
  }

  getIcon() {
    return this.icons[this.type];
  }
}
