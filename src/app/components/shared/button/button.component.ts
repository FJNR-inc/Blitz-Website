import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() text;
  @Input() type = 1;
  @Input() disabled = false;

  @Input() reverseColor = false;

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  clicked() {
    this.onClick.emit();
  }
}
