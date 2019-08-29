import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retreat} from '../../../models/retreat';

@Component({
  selector: 'app-retreat-preview',
  templateUrl: './retreat-preview.component.html',
  styleUrls: ['./retreat-preview.component.scss']
})
export class RetreatPreviewComponent implements OnInit {

  @Input() retreat: Retreat;
  @Input() displaySubscribeButton = false;

  @Output() subscribe: EventEmitter<any> = new EventEmitter();

  displayDetails = false;

  constructor() { }

  ngOnInit() {
  }

  subscribeToRetreat() {
    this.subscribe.emit();
  }

  toggleDetails() {
    this.displayDetails = !this.displayDetails;
  }
}
