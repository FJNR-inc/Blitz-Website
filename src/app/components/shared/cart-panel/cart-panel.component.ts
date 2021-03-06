import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cart-panel',
  templateUrl: './cart-panel.component.html',
  styleUrls: ['./cart-panel.component.scss']
})
export class CartPanelComponent implements OnInit {


  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() finalize: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closePanel() {
    this.close.emit();
  }

  clickedToFinalize() {
    this.finalize.emit();
  }
}
