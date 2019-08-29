import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retreat} from '../../../models/retreat';

@Component({
  selector: 'app-authentication-panel',
  templateUrl: './authentication-panel.component.html',
  styleUrls: ['./authentication-panel.component.scss']
})
export class AuthenticationPanelComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() onAuthentication: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closePanel() {
    this.close.emit();
  }

  authentified() {
    this.onAuthentication.emit();
  }
}
