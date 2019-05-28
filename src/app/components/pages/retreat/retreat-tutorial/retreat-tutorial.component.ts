import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-retreat-tutorial',
  templateUrl: './retreat-tutorial.component.html',
  styleUrls: ['./retreat-tutorial.component.scss']
})
export class RetreatTutorialComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeTutorial() {
    this.close.emit();
  }
}
