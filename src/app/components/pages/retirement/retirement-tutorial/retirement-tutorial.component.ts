import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-retirement-tutorial',
  templateUrl: './retirement-tutorial.component.html',
  styleUrls: ['./retirement-tutorial.component.scss']
})
export class RetirementTutorialComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeTutorial() {
    this.close.emit();
  }
}
